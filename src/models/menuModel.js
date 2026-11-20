import pool from './db.js';

export async function getAllMenuItems() {
    const { rows } = await pool.query(
        `SELECT
            menu_item_id,
            category,
            name,
            servings_per_tray,
            price_per_serving::float AS price_per_serving,
            (servings_per_tray * price_per_serving)::float AS tray_price,
            description,
            image,
            is_available
        FROM cse340finalproject.menu_item
        WHERE is_available = TRUE
        ORDER BY category, menu_item_id`
    );
    return rows;
}

export async function getMenuItemsByCategory() {
    const items = await getAllMenuItems();
    return items.reduce((grouped, item) => {
        if (!grouped[item.category]) {
            grouped[item.category] = [];
        }
        grouped[item.category].push(item);
        return grouped;
    }, {});
}

export async function getMenuItemById(menuItemId) {
    const { rows } = await pool.query(
        `SELECT
            menu_item_id,
            category,
            name,
            servings_per_tray,
            price_per_serving::float AS price_per_serving,
            (servings_per_tray * price_per_serving)::float AS tray_price,
            description,
            image,
            is_available
        FROM cse340finalproject.menu_item
        WHERE menu_item_id = $1 AND is_available = TRUE`,
        [menuItemId]
    );
    return rows[0] || null;
}