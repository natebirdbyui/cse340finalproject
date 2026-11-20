const GUEST_KEY = "hipoc_guest_count";

console.log("guestCalculator.js loaded");

function calculateRecommendations(guests) {
    const cards = document.querySelectorAll(".menu-card");

    cards.forEach((card) => {
        const servingsPerTray = Number(card.dataset.servingsPerTray);
        const trayPrice = Number(card.dataset.trayPrice);
        const itemId = card.dataset.menuItemId;
        const target = card.querySelector(`[data-recommended-for="${itemId}"]`)
            || card.querySelector(".recommended-trays");

        if (!target) return;

        if (!guests || guests < 1 || !servingsPerTray || servingsPerTray < 1) {
            target.textContent = "";
            card.dataset.recommendedTrays = "1";
            return;
        }

        const traysNeeded = Math.ceil(guests / servingsPerTray);
        const estimatedCost = Number.isFinite(trayPrice) ? traysNeeded * trayPrice : 0;

        card.dataset.recommendedTrays = String(traysNeeded);
        target.textContent = `Recommended: ${traysNeeded} tray${traysNeeded === 1 ? "" : "s"} (~$${estimatedCost.toFixed(2)})`;
    });
}

export function initGuestCalculator() {
    const input = document.getElementById("guest-count");
    if (!input) return;

    const savedGuests = Number.parseInt(localStorage.getItem(GUEST_KEY) || "", 10);
    if (Number.isInteger(savedGuests) && savedGuests >= 1 && savedGuests <= 2000) {
        input.value = String(savedGuests);
        calculateRecommendations(savedGuests);
    } else {
        calculateRecommendations(0);
    }

    input.addEventListener("input", () => {
        if (input.value === "") {
            localStorage.removeItem(GUEST_KEY);
            calculateRecommendations(0);
            window.dispatchEvent(new Event("guest:update"));
            return;
        }

        let guests = Number.parseInt(input.value, 10);
        if (!Number.isInteger(guests) || guests < 1) {
            input.value = "";
            localStorage.removeItem(GUEST_KEY);
            calculateRecommendations(0);
            window.dispatchEvent(new Event("guest:update"));
            return;
        }

        if (guests > 2000) {
            guests = 2000;
            input.value = String(guests);
        }

        localStorage.setItem(GUEST_KEY, String(guests));
        calculateRecommendations(guests);
        window.dispatchEvent(new Event("guest:update"));
        console.log(`Guest count updated: ${guests}`);
    });
}