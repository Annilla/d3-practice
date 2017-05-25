import { Router } from 'director/build/director.js';

const routes = {
  // 首頁
  '/': require('./pages/index')['default'],
  '/index.html': require('./pages/index')['default'],
};

// npm run prod use: /website2017/dist

// const routes = {
//   // 首頁
//   '/d3-practice/dist/': require('./pages/index')['default'],
//   '/d3-practice/dist/index.html': require('./pages/index')['default'],
// };

export default new Router(routes);