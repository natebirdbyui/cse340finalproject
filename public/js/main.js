// main.js

import { initSidebarMenu } from "./navigation.js";

console.log("main.js loaded:", location.pathname);

document.addEventListener("DOMContentLoaded", async () => {
    // Site-wide (every page)
    initSidebarMenu();

    // Home Page
    if (document.querySelector(".hero-banner")) {
        const { loadSlideshow } = await import("./slideshow.js");
        const { loadMealOfTheDay } = await import("./mealOfTheDay.js");

        loadSlideshow();
        loadMealOfTheDay();
    }

    // About Us Page
    if (document.querySelector(".owner-reel")) {
        const { loadAboutUsSlideshow } = await import("./aboutUs.js");
        loadAboutUsSlideshow();
    }

    // Menu Page
    if (document.querySelector(".menu-page")) {
        const { initGuestCalculator } = await import("./guestCalculator.js");
        const { initCartSidebar, initAddToCart } = await import("./cartUI.js");
        const { initCheckoutBar } = await import("./checkoutUI.js");
        const { initMobileCart } = await import("./mobileCart.js");
        const { initCheckoutNavigation } = await import("./checkoutNavigation.js");

        initGuestCalculator();
        initCartSidebar();
        initAddToCart();
        initCheckoutBar();
        initMobileCart();
        initCheckoutNavigation();
    }

    // Booking Page
    if (document.querySelector("#checkout-form")) {
        const { initBookingPage } = await import("./booking.js");
        const { initGuestCalculator } = await import("./guestCalculator.js");
        const { initBookingValidation } = await import("./bookingValidation.js");
        const { initCheckoutNavigation } = await import("./checkoutNavigation.js");
        const { initCalendar } = await import("./calendar.js");

        initBookingPage();
        initGuestCalculator();
        initBookingValidation();
        initCheckoutNavigation();
        initCalendar();
    }

    // Cart Page
    if (document.querySelector(".cart-page")) {
        const { initCartPage } = await import("./cartPage.js");
        const { initCheckoutNavigation } = await import("./checkoutNavigation.js");

        initCartPage();
        initCheckoutNavigation();
    }

    // Checkout Complete Page
    if (document.querySelector(".checkout-complete")) {
        const { initCheckoutComplete } = await import("./checkoutComplete.js");
        initCheckoutComplete();
    }
});