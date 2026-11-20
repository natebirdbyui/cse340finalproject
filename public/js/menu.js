// menu.js
let menuData = [];
console.log("menu.js loaded");

export async function loadMenu() {
    try {
        console.log(
            "Fetching menu from:",
            `/data/menu.json`
        );

        const res = await fetch(
            `/data/menu.json`
        );

        if (!res.ok) {
            throw new Error(
                "Failed to load menu.json"
            );
        }

        const data = await res.json();

        // DEBUG
        console.log(
            "RAW MENU JSON:",
            data
        );

        menuData = data.menu;
        return menuData;
    } catch (err) {
        console.error(
            "Menu load error:",
            err
        );
        return [];
    }

}
// NEW
// Allows other modules to get the loaded menu
export function getMenu() {
    return menuData;
}