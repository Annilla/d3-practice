import * as d3 from "d3";
window.axios = require('axios');

function numberArray (obj) {
  let newdata = [];
  obj.forEach(function(element){
    newdata.push(element.number);
  });
  return newdata;
}

let canvas = {
  sample: {},
  svg: {},
  xScale: {},
  yScale: {},
  bars: {},
  texts: {},
  labels: {},
  config: {
    svgW: 500,
    svgH: 500,
    top: 30,
    right: 30,
    bottom: 100,
    left: 60,
    barW: 50
  },
  init: function () {
    // 插入 SVG
    this.svg = d3.select('.chart').append('svg')
      .attr('class', 'svg')
      .attr('width', this.config.svgW + this.config.left + this.config.right) //將左右補滿
      .attr('height', this.config.svgH + this.config.top + this.config.bottom) //上下補滿
      .append('g') //增加一個群組g
      .attr('transform', 'translate(' + this.config.left + ',' + this.config.top + ')');
    // 繼續進行資料綁定和繪製
    this.bind();
    this.rendor();
  },
  bind: function () {
    let dataset = this.sample;
    let Ymax = 0;
    let max = 0; // Compare with Ymax
    let Ymin = 0;
    let tickLabels = [''];
    // Set Ymax
    dataset.narray = numberArray(dataset.value);
    max = d3.max(dataset.narray);
    Ymax = max > Ymax ? max : Ymax;
    // Set tickLabels
    dataset.value.forEach(function (element) {
      tickLabels.push(element.month);
    });
    this.xScale = d3.scaleLinear().domain([0, dataset.value.length+1]).range([0, this.config.svgW]);
    this.yScale = d3.scaleLinear().domain([Ymin, Ymax]).range([this.config.svgH, 0]);
    // x,y 座標 scale
    let xAxis = d3.axisBottom(this.xScale).ticks(5).tickFormat((d,i) => { return tickLabels[i] });
    let yAxis = d3.axisLeft(this.yScale).tickSizeInner(-this.config.svgH);
    // SVG 加入 x 軸線
    this.svg.append('g')
      .attr("transform", `translate(0, ${this.config.svgH})`)
      .attr('class', 'x axis')
      .call(xAxis);
    // SVG 加入 y 軸線
    this.svg.append('g')
      .attr("transform", `translate(0, 0)`)
      .attr('class', 'y axis')
      .call(yAxis);
    // SVG 加入 y 軸名稱
    this.svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - this.config.left)
        .attr("x",0 - (this.config.svgH / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("件數");
    // 繪製 bar
    this.bars = this.svg.append('g')
      .attr('class','bars')
      .selectAll('rect.bar')
      .data(dataset.value)
      .enter()
      .append('rect') //塞好'rect'
      .attr('class', 'bar'); //準備好Class
    // 繪製 texts
    this.texts = this.svg.append('g')
      .attr('class','texts')
      .selectAll('text.text')
      .data(dataset.value)
      .enter()
      .append('text') //塞好'text'
      .attr('class', 'text');
    // 繪製 label
    this.labels = this.svg.append('g')
      .attr('class','label');
  },
  rendor: function () {
    let dataset = this.sample;
    let color = d3.scaleOrdinal(d3.schemeCategory10);
    let barWidth = this.config.barW;
    let tooltip = '.tooltip';
    // 將資料套用 d3.line()
    this.bars.attr('fill', color(0))
      .attr('x', (d,i) => { return this.xScale(i+1) - barWidth/2; })
      .attr('y', (d) => { return this.yScale(d.number); })
      .attr('width', barWidth)
      .attr('height', (d) => { return this.config.svgH - this.yScale(d.number); });
    // 插入 texts 標示
    this.texts.attr('fill', 'white')
      .attr('text-anchor', 'middle')
      .attr('x', (d,i)=>{ return this.xScale(i+1) })
      .attr('y', (d) => { return this.yScale(d.number)+20; })
      .text((d)=>{ return d.number});
    // 插入 label 標示
    this.labels.append('rect')
      .attr('class','labelrect')
      .attr('fill', color(0))
      .attr('x', 0)
      .attr('y', this.config.svgH + 40)
      .attr('width', '10')
      .attr('height', '10');
    this.labels.append('text')
      .attr('class','labeltext')
      .attr('fill', color(0))
      .attr('x', 15)
      .attr('y', this.config.svgH + 50)
      .text(dataset.name);
    // 滑過出現 tooltip
    this.svg.selectAll('.bar').on('mouseover', function(d,i){
      let mousePos = d3.mouse(this); //取得滑鼠座標
      let xPos = mousePos[0] + 70;
      let yPos = mousePos[1]; //修正滑鼠座標
      // 將Tooltip補上資料
      d3.select(tooltip)
        .classed('hidden', false)
        .style('left', `${xPos}px`)
        .style('top', `${yPos}px`);
      // 插入名稱
      d3.select('.tooltip .name').html(`鼓山區 / ${d.month}`);
      d3.select('.tooltip .value').html(`${d.number} 件`);
    }).on('mouseout', function(d){
      // 切換顯示及隱藏
      d3.select(tooltip).classed('hidden', true);
    });
  }
}


export function chart() {
  // Get Data
  axios.get('//teststset.getsandbox.com/d3data3')
    .then(function (response) {
      // Get data
      canvas.sample = response.data.result;
      // Start d3
      canvas.init();
    })
    .catch(function (error) {
      console.log(`ERROR: ${error}`);
    });
}
