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
  dots: {},
  path: {},
  labels: {},
  config: {
    svgW: 500,
    svgH: 500,
    top: 30,
    right: 30,
    bottom: 100,
    left: 60
  },
  init: function () {
    // 插入 SVG
    this.svg = d3.select('.chart').append('svg')
      .attr('class', 'svg')
      .attr('viewBox', `0 0 ${this.config.svgW + this.config.left + this.config.right} ${this.config.svgH + this.config.top + this.config.bottom}`)
      .append('g') //增加一個群組g
      .attr('transform', 'translate(' + this.config.left + ',' + this.config.top + ')');
    // 繼續進行資料綁定和繪製
    this.bind();
    this.rendor();
  },
  bind: function () {
    let dataset = this.sample;
    let Ymax = 0;
    let Ymin = 0;
    let tickLabels = [''];
    dataset.forEach(function (element, i) {
      element.narray = numberArray(element.value);
      let max = d3.max(element.narray);
      Ymax = max > Ymax ? max : Ymax;
    });
    dataset[0].value.forEach(function (element) {
      tickLabels.push(element.month);
    });
    this.xScale = d3.scaleLinear().domain([0, dataset[0].value.length]).range([0, this.config.svgW]);
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
    // 繪製 line
    this.path = this.svg.selectAll('g.line')
      .data(dataset) //將資料放入pie
      .enter()
      .append('g') //塞好'g'
      .attr('class', 'line'); //準備好Class
    // 繪製座標點
    this.dots = this.svg.selectAll('g.dot')
      .data(dataset)
      .enter()
      .append('g') //塞好'g'
      .attr('class', 'dot') //準備好Class
      .selectAll("circle.circle")
      .data(function(d) { return d.value; })
      .enter()
      .append("circle")//塞好'circle'
      .attr('class', 'circle'); //準備好Class
    // 繪製 label
    this.labels = this.svg.selectAll('g.label')
      .data(dataset)
      .enter()
      .append('g') //塞好'g'
      .attr('class', 'label');
  },
  rendor: function () {
    let dataset = this.sample;
    let color = d3.scaleOrdinal(d3.schemeCategory10);
    let tooltip = '.tooltip';
    let dotIndex = 0; // dot color
    let svgH = this.config.svgH;
    // 增加一個line function，用來把資料轉為x, y
    let line = d3.line()
      .x((d,i) => {
        return this.xScale(i+1); //利用尺度運算資料索引，傳回x的位置
      })
      .y((d) => {
        return this.yScale(d); //利用尺度運算資料的值，傳回y的位置
      });
    // 將資料套用 d3.line()
    this.path.append('path')
      .attr('fill', 'none')
      .attr('stroke', (d,i) => { return color(i); })
      .attr('d', (d) => { return line(d.narray); });
    // 加入座標點
    this.dots.attr("cx",(d,i)=>{ return this.xScale(i+1); })
      .attr("cy",(d)=>{ return this.yScale(d.number); })
      .attr("r","5")
      .attr("fill", () => {
        dotIndex ++;
        return color(Math.floor((dotIndex-1)/5)); })
      .attr("stroke", "white");
    // 插入 label 標示
    this.labels.append('circle')
      .attr('cx', (d,i)=>{ return i*100 })
      .attr('cy', svgH+75)
      .attr('r', 5)
      .attr('fill', (d,i)=>{ return color(i); });
    this.labels.append('text')
      .attr('x', (d,i)=>{ return i*100+10 })
      .attr('y', svgH+80)
      .text((d)=>{ return d.name});
    // 滑過出現 tooltip
    this.svg.selectAll('.circle').on('mouseover', function(d,i){
      let mousePos = d3.mouse(this); //取得滑鼠座標
      let xPos = mousePos[0] + 80;
      let yPos = mousePos[1]; //修正滑鼠座標
      // 將Tooltip補上資料
      d3.select(tooltip)
        .classed('hidden', false)
        .style('left', `${xPos}px`)
        .style('top', `${yPos}px`);
      // 插入名稱
      d3.select('.tooltip .name').html(`${dataset[Math.floor(i/5)].name} / ${d.month}`);
      d3.select('.tooltip .value').html(`${d.number} 件`);
    }).on('mouseout', function(d){
      // 切換顯示及隱藏
      d3.select(tooltip).classed('hidden', true);
    });
  }
}


export function chart() {
  // Get Data
  axios.get('//teststset.getsandbox.com/d3data2')
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
