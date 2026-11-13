import Router from 'express';
import { homePage, menuPage, bookingPage, contactPage, aboutPage, cartPage, loginPage, registerPage } from './index.js';
const router = Router();

//router.get [pages]
router.get('/', homePage);
router.get('/menu', menuPage);
router.get('/booking', bookingPage);
router.get('/contact', contactPage);
router.get('/about', aboutPage);
router.get('/cart', cartPage);
router.get('/login', loginPage);
router.get('/register', registerPage);

//Add CSS styles to certain pages if needed
router.use('/about', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/partials/about-us.css">');
    next();
});

router.use('/booking', (req, res, next) => {
    res.addStyle('<link rel="stylesheet" href="/css/partials/booking.css">');
    next();
});

export default router;