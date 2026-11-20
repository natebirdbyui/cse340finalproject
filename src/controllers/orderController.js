import { getMenuItemById } from '../models/menuModel.js';
import { createBooking } from '../models/bookingModel.js';

const TAX_RATE = 0.06;

function ensureCart(req) {
    if (!req.session) return [];
    if (!Array.isArray(req.session.cart)) {
        req.session.cart = [];
    }
    return req.session.cart;
}

function summarizeCart(cart) {
    const subtotal = cart.reduce(
        (sum, item) => sum + Number(item.tray_price) * Number(item.trays),
        0
    );
    const tax = Number((subtotal * TAX_RATE).toFixed(2));
    const total = Number((subtotal + tax).toFixed(2));
    const totalTrays = cart.reduce((sum, item) => sum + Number(item.trays), 0);

    return {
        items: cart,
        totalTrays,
        subtotal: Number(subtotal.toFixed(2)),
        tax,
        total
    };
}

export const addToCart = async (req, res, next) => {
    try {
        const menuItemId = Number.parseInt(req.body.menu_item_id, 10);
        const traysToAdd = Math.max(1, Number.parseInt(req.body.trays || '1', 10));

        const menuItem = await getMenuItemById(menuItemId);
        if (!menuItem) {
            return res.status(404).json({ error: 'Menu item not found.' });
        }

        const cart = ensureCart(req);
        const existing = cart.find((item) => item.menu_item_id === menuItem.menu_item_id);

        if (existing) {
            existing.trays += traysToAdd;
        } else {
            cart.push({
                menu_item_id: menuItem.menu_item_id,
                name: menuItem.name,
                category: menuItem.category,
                image: menuItem.image,
                servings_per_tray: Number(menuItem.servings_per_tray),
                price_per_serving: Number(menuItem.price_per_serving),
                tray_price: Number(menuItem.tray_price),
                trays: traysToAdd
            });
        }

        const summary = summarizeCart(cart);
        if (req.headers.accept?.includes('application/json')) {
            return res.json({ ok: true, cart: summary });
        }
        return res.redirect('/menu');
    } catch (err) {
        next(err);
    }
};

export const updateCartItem = (req, res) => {
    const menuItemId = Number.parseInt(req.body.menu_item_id, 10);
    const trays = Number.parseInt(req.body.trays, 10);
    const cart = ensureCart(req);

    if (!Number.isInteger(trays) || trays <= 0) {
        req.session.cart = cart.filter((item) => item.menu_item_id !== menuItemId);
    } else {
        const target = cart.find((item) => item.menu_item_id === menuItemId);
        if (target) target.trays = trays;
    }

    const summary = summarizeCart(req.session.cart);
    if (req.headers.accept?.includes('application/json')) {
        return res.json({ ok: true, cart: summary });
    }
    return res.redirect('/cart');
};

export const removeCartItem = (req, res) => {
    const menuItemId = Number.parseInt(req.body.menu_item_id, 10);
    const cart = ensureCart(req);
    req.session.cart = cart.filter((item) => item.menu_item_id !== menuItemId);

    const summary = summarizeCart(req.session.cart);
    if (req.headers.accept?.includes('application/json')) {
        return res.json({ ok: true, cart: summary });
    }
    return res.redirect('/cart');
};

export const getCartJson = (req, res) => {
    res.json({ ok: true, cart: summarizeCart(ensureCart(req)) });
};

export const renderCartPage = (req, res) => {
    res.render('cart', {
        title: 'Your Cart',
        cart: summarizeCart(ensureCart(req))
    });
};

export const renderBookingPage = (req, res) => {
    res.render('booking', {
        title: 'Booking & Checkout',
        cart: summarizeCart(ensureCart(req)),
        formData: {},
        errorMessage: null
    });
};

export const submitBooking = async (req, res, next) => {
    try {
        const cartSummary = summarizeCart(ensureCart(req));
        const customerName = (req.body.customer_name || '').trim();
        const customerEmail = (req.body.customer_email || '').trim();
        const customerPhone = (req.body.customer_phone || '').trim() || null;
        const eventDate = (req.body.event_date || '').trim();
        const guestCount = Number.parseInt(req.body.guest_count, 10);
        const notes = (req.body.notes || '').trim() || null;

        if (!cartSummary.items.length) {
            return res.status(400).render('booking', {
                title: 'Booking & Checkout',
                cart: cartSummary,
                formData: req.body,
                errorMessage: 'Please add at least one menu tray before completing your order.'
            });
        }

        if (!customerName || !customerEmail || !eventDate || !Number.isInteger(guestCount) || guestCount < 1) {
            return res.status(400).render('booking', {
                title: 'Booking & Checkout',
                cart: cartSummary,
                formData: req.body,
                errorMessage: 'Please fill out your name, email, event date, and a valid guest count.'
            });
        }

        const userId = req.session?.user?.user_id || req.session?.userId || null;

        const confirmation = await createBooking({
            userId,
            customerName,
            customerEmail,
            customerPhone,
            eventDate,
            guestCount,
            notes,
            cartItems: cartSummary.items,
            taxRate: TAX_RATE
        });

        req.session.cart = [];
        req.session.lastBooking = confirmation;

        return res.render('booking', {
            title: 'Order Confirmed',
            cart: summarizeCart([]),
            formData: {},
            errorMessage: null,
            confirmation
        });
    } catch (err) {
        next(err);
    }
};