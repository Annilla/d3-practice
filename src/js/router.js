import { Router } from 'director/build/director.js';
let DEV_MODE = true;
let routes;

if (DEV_MODE) {
  // npm run dev use: /
  routes = {
    // 首頁
    '/': require('./pages/index')['default'],
    '/index.html': require('./pages/index')['default'],
    // 圓餅圖
    '/pie.html': require('./pages/pie')['default'],
    // 甜甜圈圖
    '/donut.html': require('./pages/donut')['default'],
    // 折線圖
    '/line.html': require('./pages/line')['default'],
    // 長條圖
    '/bar.html': require('./pages/bar')['default']
  };
}
else {
  // npm run prod use: /website2017/dist
  routes = {
    // 首頁
    '/d3-practice/dist/': require('./pages/index')['default'],
    '/d3-practice/dist/index.html': require('./pages/index')['default'],
    // 圓餅圖
    '/d3-practice/dist/pie.html': require('./pages/pie')['default'],
    // 甜甜圈圖
    '/d3-practice/dist/donut.html': require('./pages/donut')['default'],
    // 折線圖
    '/d3-practice/dist/line.html': require('./pages/line')['default'],
    // 長條圖
    '/d3-practice/dist/bar.html': require('./pages/bar')['default']
  };
}

export default new Router(routes);