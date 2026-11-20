import { getAllMenuItems, getMenuItemsByCategory } from '../models/menuModel.js';
/**
 * Controller for rendering the home page
 */
export const homePage = (req, res) => {
    res.render('home', {
        title: 'Home'
    });
};

export const menuPage = async (req, res, next) => {
    try {
        const menuItems = await getAllMenuItems();
        const menuByCategory = await getMenuItemsByCategory();

        res.render('menu', {
            title: 'Menu',
            menuItems,
            menuByCategory
        });
    } catch (err) {
        next(err);
    }
};

export const bookingPage = (req, res) => {
    res.render('booking', {
        title: 'Booking'
    });
};

export const contactPage = (req, res) => {
    res.render('forms/contact_us/contact_us', {
        title: 'Contact Us'
    });
};

export const aboutPage = (req, res) => {
    res.render('about_us', {
        title: 'About Us'
    });
};

export const cartPage = (req, res) => {
    res.render('cart', {
        title: 'Cart'
    });
};

export const loginPage = (req, res) => {
    res.render('login', {
        title: 'Login'
    });
};  

export const registerPage = (req, res) => {
    res.render('register', {
        title: 'Register'
    });
};  

export const userPage = (req, res) => {
    res.render('users', {
        title: 'Users'
    });
};
