import db from './db.js';

/**
 * Persists a booking and its line items inside a single transaction.
 */
export async function createBooking({
    userId = null,
    customerName,
    customerEmail,
    customerPhone = null,
    eventDate,
    guestCount,
    notes = null,
    cartItems,
    taxRate = 0.06
}) {
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
        throw new Error('Cannot create a booking with an empty order.');
    }

    const subtotal = cartItems.reduce(
        (sum, item) => sum + Number(item.tray_price) * Number(item.trays),
        0
    );
    const tax = Number((subtotal * taxRate).toFixed(2));
    const totalAmount = Number((subtotal + tax).toFixed(2));

    const client = typeof db.connect === 'function' ? await db.connect() : db;
    const ownsClient = typeof db.connect === 'function';

    try {
        if (ownsClient) await client.query('BEGIN');

        const bookingResult = await client.query(
            `INSERT INTO cse340finalproject.booking
                (user_id, customer_name, customer_email, customer_phone, event_date, guest_count, notes, status, total_amount)
             VALUES ($1, $2, $3, $4, $5, $6, $7, 'confirmed', $8)
             RETURNING booking_id, customer_name, customer_email, event_date, guest_count, status, total_amount, created_at`,
            [
                userId,
                customerName,
                customerEmail,
                customerPhone,
                eventDate,
                guestCount,
                notes,
                totalAmount
            ]
        );

        const booking = bookingResult.rows[0];

        for (const item of cartItems) {
            await client.query(
                `INSERT INTO cse340finalproject.booking_item
                    (booking_id, menu_item_id, trays, servings_per_tray, price_per_serving)
                 VALUES ($1, $2, $3, $4, $5)`,
                [
                    booking.booking_id,
                    item.menu_item_id,
                    item.trays,
                    item.servings_per_tray,
                    item.price_per_serving
                ]
            );
        }

        if (ownsClient) await client.query('COMMIT');

        return {
            ...booking,
            subtotal: Number(subtotal.toFixed(2)),
            tax,
            items: cartItems
        };
    } catch (err) {
        if (ownsClient) await client.query('ROLLBACK');
        throw err;
    } finally {
        if (ownsClient && typeof client.release === 'function') {
            client.release();
        }
    }
}