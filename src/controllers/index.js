/**
 * Controller for rendering the home page
 */
export const homePage = (req, res) => {
    res.render('home', {
        title: 'Home'
    });
};

export const menuPage = (req, res) => {
    res.render('menu', {
        title: 'Menu'
    });
};

export const bookingPage = (req, res) => {
    res.render('booking', {
        title: 'Booking'
    });
};

export const contactPage = (req, res) => {
    res.render('contact', {
        title: 'Contact Us'
    });
};

export const aboutPage = (req, res) => {
    res.render('about', {
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
