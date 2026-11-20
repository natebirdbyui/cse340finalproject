import {Router} from 'express';
import { homePage, menuPage, bookingPage, contactPage, aboutPage, cartPage, loginPage, registerPage, userPage } from './index.js';
import {
    addToCart,
    updateCartItem,
    removeCartItem,
    getCartJson,
    renderCartPage,
    renderBookingPage,
    submitBooking
} from './orderController.js';
const router = Router();

//router.get [pages]
router.get('/', homePage);
router.get('/menu', menuPage);
router.get('/booking', bookingPage);
router.get('/contact_us', contactPage);
router.get('/about_us', aboutPage);
router.get('/cart', cartPage);
router.get('/login', loginPage);
router.get('/register', registerPage);
router.get('/users', userPage)

//Cart and booking routes
router.get('/api/cart', getCartJson);
router.post('/cart/add', addToCart);
router.post('/cart/update', updateCartItem);
router.post('/cart/remove', removeCartItem);
router.get('/cart', renderCartPage);

router.get('/booking', renderBookingPage);
router.post('/booking', submitBooking);

//Add CSS styles to certain pages if needed
router.use('/', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/partials/hero-banner.css">');
    next();
});

router.use('/about_us', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/partials/about-us.css">');
    next();
});

router.use('/booking', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/partials/booking.css"> <link rel="stylesheet" href="/css/partials/calendar.css">');
    next();
});

router.use('/menu', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/partials/menu.css">');
    next();
});

router.use('/contact_us', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/partials/contact-us.css">');
    next();
});

router.use('/cart', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/partials/cart-page.css">');
    next();
}); 




export default router;