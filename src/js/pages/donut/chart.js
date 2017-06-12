import * as d3 from "d3";
window.axios = require('axios');

let canvas = {
  sample: {},
  svg: {},
  arcs: {},
  labels: {},
  labeltexts: {},
  config: {
    svgW: 600,
    svgH: 600,
    innerRadius: 100,
    outerRadius: 200,
    labelX: 450
  },
  percentage: function () {
    // 計算百分比
    let data = this.sample;
    let total = d3.sum(data, function(d) { return d.value; });
    let format =  d3.format(".0p");
    this.sample.forEach(function(el){
        el.percentage = format(el.value / total);
    });
  },
  init: function () {
    // 資料加入 percentage
    this.percentage();
    // 插入 SVG
    this.svg = d3.select('.chart').append('svg')
      .attr('class', 'svg')
      .attr('viewBox', `0 0 ${this.config.svgW} ${this.config.svgH}`);
    // 繼續進行資料綁定和繪製
    this.bind();
    this.rendor();
  },
  bind: function () {
    let data = this.sample;
    // 建立 D3 pie 物件
    let pie = d3.pie()
      .sort(null)
      .value(function(d) { return d.value; })
      (data);

    // 繪製 path
    this.arcs = this.svg.selectAll('g.arc')
      .data(pie) //將資料放入pie
      .enter()
      .append('g') //塞好'g'
      .attr('class', 'arc') //準備好Class
      .attr('transform', `translate(${this.config.outerRadius},${this.config.outerRadius})`); //移動圓心的位置
    
    // 繪製 label
    this.labels = this.svg.selectAll('g.label')
      .data(data)
      .enter()
      .append('g') //塞好'g'
      .attr('class', 'label');
    this.labeltexts = this.labels.append('text')
      .attr('class', 'tGroup')
      .attr('x', this.config.labelX + 15)
      .attr('y', function(d,i) {
        return (i+1)*30;
      });
  },
  rendor: function () {
    // 設定 path fill and d value
    let arc = d3.arc().innerRadius(this.config.innerRadius).outerRadius(this.config.outerRadius);
    let color = d3.scaleOrdinal(d3.schemeCategory20c);
    // 設定 tooltip
    let tooltip = '.tooltip';
    let outerRadius = this.config.outerRadius;

    // 繪製 path
    this.arcs.append('path')
      .attr('fill', function(d,i){ return color(i); })
      .attr('d', arc);
    // 插入 chart 內文字
    this.arcs.append('text')
      .attr('transform', function(d){
        return `translate(${arc.centroid(d)})`;
        //centroid()任何形狀的中心點
      })
      .attr('text-anchor', 'middle')
      .text(function(d){
        return  d.data.percentage; //在每個形狀的中央插入文字
      })
      .attr('fill', 'white');
    
    // 插入 label 標示
    this.labels.append('rect')
      .attr('x', this.config.labelX)
      .attr('y', function(d,i) {
        return -11 + (i+1)*30;
      })
      .attr('width', 10)
      .attr('height', 10)
      .attr('fill', function(d,i){ return color(i); });
    this.labeltexts.append('tspan')
      .text(function(d){
        return  d.name;
      });
    this.labeltexts.append('tspan')
      .text(function(d){
        return  ` ${d.percentage}`;
      })
      .attr('fill', '#ccc');
    
    // 滑過出現 tooltip
    this.svg.selectAll('.arc').on('mouseover', function(d){
      let mousePos = d3.mouse(this); //取得滑鼠座標
      let xPos = mousePos[0] + outerRadius;
      let yPos = mousePos[1] + outerRadius; //修正滑鼠座標

      // 將Tooltip補上資料
      d3.select(tooltip)
        .classed('hidden', false)
        .style('left', `${xPos}px`)
        .style('top', `${yPos}px`);
      // 插入名稱
      d3.select('.tooltip .name').html(`${d.data.name} / ${d.data.percentage}`);
      d3.select('.tooltip .value').html(`${d.data.value} 件`);
    }).on('mouseout', function(d){
      // 切換顯示及隱藏
      d3.select(tooltip).classed('hidden', true);
    });
  }
}


export function chart() {
  // Get Data
  axios.get('//teststset.getsandbox.com/d3data')
    .then(function (response) {
      // 過濾小於 100 大於 500 的數據
      let data = response.data.result;
      let newdata = [];
      data.forEach(function(element) {
        if (element.value > 100 && element.value < 500) {
          newdata.push(element);
        }
      });
      canvas.sample = newdata;
      // Start d3
      canvas.init();
    })
    .catch(function (error) {
      console.log(`ERROR: ${error}`);
    });
}
