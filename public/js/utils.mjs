// utils.mjs
//sets up header for mobile and desktop versions.
console.log("utils.mjs loaded");
export function loadNav() {   
        return `
        <div class="header-top">
            <button class="nav-toggle">☰</button>
            
            <div class="logo">
                <figure>
                    <picture>
                        <source srcset="/images/logo_and_banner/rsz_rsz_1logo.png" type="image/webp">
                        <img src="/images/logo_and_banner/rsz_rsz_1logo.png"
                        alt="HIPOC Logo"
                        width="250"
                        height="250">
                    </picture>
                </figure>
            </div>

            <nav class="cart-nav">
                <a href="/cart/cart.html">🛒 Cart</a>
            </nav>
        </div>

        <!-- Sidebar navigation -->
        <div class="sidebar-overlay"></div>

        <!-- Desktop navigation -->
        <div class="desktop-nav">
            <a href="/">Home</a>
                <a href="/menu/menu.html">Menu</a>            
                <a href="/booking/booking.html">Booking</a>
                <a href="/contact_us/contact_us.html">Contact Us</a>
                <a href="/about_us/about_us.html">About Us</a>
        </div>

        <aside class="sidebar-nav">
            <nav class="sidebar-links">
                <a href="/">Home</a>
                <a href="/menu/menu.html">Menu</a>            
                <a href="/booking/booking.html">Booking</a>
                <a href="/contact_us/contact_us.html">Contact Us</a>
                <a href="/about_us/about_us.html">About Us</a>
                
            </nav>
        </aside>        
    `;
}
