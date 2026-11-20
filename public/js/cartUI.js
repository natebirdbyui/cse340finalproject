import { flyToCart } from "./cartAnimation.js";

console.log("cartUI.js loaded");

let currentCart = {
    items: [],
    totalTrays: 0,
    subtotal: 0,
    tax: 0,
    total: 0
};

function dispatchCartUpdate(cart) {
    window.dispatchEvent(
        new CustomEvent("cart:update", {
            detail: {
                cart,
                totals: {
                    subtotal: cart.subtotal ?? 0,
                    tax: cart.tax ?? 0,
                    total: cart.total ?? 0
                }
            }
        })
    );
}

export async function refreshCartSidebar() {
    try {
        const res = await fetch("/api/cart", {
            headers: { Accept: "application/json" }
        });
        if (!res.ok) return;
        const data = await res.json();
        if (data.ok && data.cart) {
            currentCart = data.cart;
            renderCart(currentCart);
            dispatchCartUpdate(currentCart);
        }
    } catch (err) {
        console.error("Failed to refresh cart sidebar:", err);
    }
}

async function postCartUpdate(menuItemId, trays) {
    const res = await fetch("/cart/update", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
            menu_item_id: Number(menuItemId),
            trays: Number(trays)
        })
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to update cart quantity");
    }
    currentCart = data.cart;
    renderCart(currentCart);
    dispatchCartUpdate(currentCart);
}

export function initCartSidebar() {
    window.addEventListener("cart:update", (e) => {
        if (e.detail?.cart) {
            currentCart = e.detail.cart;
        }
        renderCart(currentCart);
    });

    refreshCartSidebar();
}

export function initAddToCart() {
    document.addEventListener("click", async (event) => {
        const btn = event.target.closest(".add-to-order-btn");
        if (!btn) return;

        const card = btn.closest(".menu-card");
        const menuItemId = Number(btn.dataset.menuItemId || card?.dataset.menuItemId);
        if (!menuItemId) return;

        const recTrays = Number.parseInt(card?.dataset.recommendedTrays || "1", 10);
        const trays = Number.isInteger(recTrays) && recTrays >= 1 ? recTrays : 1;

        const originalText = btn.textContent.trim();
        btn.disabled = true;
        btn.textContent = "Adding...";

        try {
            const res = await fetch("/cart/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json"
                },
                body: JSON.stringify({
                    menu_item_id: menuItemId,
                    trays
                })
            });

            const data = await res.json();
            if (!res.ok || !data.ok) {
                throw new Error(data.error || "Failed to add item to order");
            }

            // Trigger fly-to-cart animation using card image -> sidebar or mobile cart button
            const cardImg = card?.querySelector("img");
            const cartTarget = document.querySelector(".cart-sidebar") || document.getElementById("open-cart");
            if (cardImg && cartTarget) {
                flyToCart(cardImg, cartTarget);
            }

            currentCart = data.cart;
            renderCart(currentCart);
            dispatchCartUpdate(currentCart);

            btn.textContent = `Added (${trays})`;
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
            }, 800);
        } catch (err) {
            console.error("Add to order failed:", err);
            btn.textContent = "Try Again";
            btn.disabled = false;
        }
    });
}

function renderCart(cartData = currentCart) {
    const items = Array.isArray(cartData.items) ? cartData.items : [];
    const container = document.getElementById("cart-sidebar-items");
    const subtotalEl = document.getElementById("cart-subtotal");
    const taxEl = document.getElementById("cart-tax");
    const totalEl = document.getElementById("cart-total");
    if (!container) return;

    const subtotal = Number(cartData.subtotal ?? 0);
    const tax = Number(cartData.tax ?? 0);
    const total = Number(cartData.total ?? 0);

    if (items.length === 0) {
        container.innerHTML = `<p>Your order is empty.</p>`;
        if (subtotalEl) subtotalEl.textContent = "0.00";
        if (taxEl) taxEl.textContent = "0.00";
        if (totalEl) totalEl.textContent = "0.00";
        return;
    }

    container.innerHTML = items.map(item => {
        const trays = Number(item.trays ?? item.quantity ?? 1);
        const trayPrice =
            Number(item.tray_price) ||
            Number(item.servings_per_tray) * Number(item.price_per_serving);
        const lineTotal = (trays * trayPrice).toFixed(2);

        return `
            <div class="cart-item">
                <span>${item.name}</span>
                <div class="qty-controls">
                    <button type="button" class="minus" data-id="${item.menu_item_id}" data-trays="${trays - 1}">
                        −
                    </button>
                    <span>${trays}</span>
                    <input
                        class="cart-quantity"
                        type="number"
                        min="0"
                        step="1"
                        value="${trays}"
                        data-id="${item.menu_item_id}">
                    <button type="button" class="plus" data-id="${item.menu_item_id}" data-trays="${trays + 1}">
                        +
                    </button>
                </div>
                <span>$${lineTotal}</span>
            </div>
        `;
    }).join("");

    container.querySelectorAll(".plus").forEach(btn => {
        btn.addEventListener("click", async () => {
            btn.disabled = true;
            await postCartUpdate(btn.dataset.id, Number(btn.dataset.trays));
        });
    });

    container.querySelectorAll(".minus").forEach(btn => {
        btn.addEventListener("click", async () => {
            btn.disabled = true;
            await postCartUpdate(btn.dataset.id, Number(btn.dataset.trays));
        });
    });

    container.querySelectorAll(".cart-quantity").forEach(input => {
        input.addEventListener("change", async () => {
            const parsed = Number.parseInt(input.value, 10);
            const nextTrays = Number.isInteger(parsed) && parsed >= 0 ? parsed : 1;
            await postCartUpdate(input.dataset.id, nextTrays);
        });
    });

    if (subtotalEl) subtotalEl.textContent = subtotal.toFixed(2);
    if (taxEl) taxEl.textContent = tax.toFixed(2);
    if (totalEl) totalEl.textContent = total.toFixed(2);
}