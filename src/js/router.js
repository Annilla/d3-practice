import { Router } from 'director/build/director.js';
let DEV_MODE = true;
let routes;

if (DEV_MODE) {
  // npm run dev use: /
  routes = {
    // 首頁
    '/': require('./pages/index')['default'],
    '/index.html': require('./pages/index')['default'],
  };
}
else {
  // npm run prod use: /website2017/dist
  routes = {
    // 首頁
    '/d3-practice/dist/': require('./pages/index')['default'],
    '/d3-practice/dist/index.html': require('./pages/index')['default'],
  };
}

export default new Router(routes);