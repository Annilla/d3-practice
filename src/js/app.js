// Main CSS
require('../scss/app.scss');

// Plugin JS
// window.Cookies = require('js-cookie');
// require('jquery');

// Main JS
import router from './router';

// Setup router configuration
const routerOptions = {
  html5history: true
};

// Run in browser
router.configure(routerOptions).init();
