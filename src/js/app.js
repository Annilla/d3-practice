// Main CSS
require('../scss/app.scss');

// Plugin JS
require("babel-polyfill");
window.axios = require('axios');

// Main JS
import router from './router';

// Setup router configuration
const routerOptions = {
  html5history: true
};

// Run in browser
router.configure(routerOptions).init();
