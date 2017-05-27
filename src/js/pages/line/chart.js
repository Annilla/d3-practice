import * as d3 from "d3";
window.axios = require('axios');

let canvas = {
  sample: {},
  svg: {},
  line: {},
  xScale: {},
  yScale: {},
  xAxis: {},
  yAxis: {},
  dots: {},
  path: {},
  config: {
    svgW: 500,
    svgH: 500,
    top: 30,
    right: 30,
    bottom: 100,
    left: 60
  },
  dotdata: function () {
    let data = this.sample[0].value;
    let newdata = [];
    data.forEach(function(element) {
      newdata.push({'value': element});
    });
    return newdata;
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
    let dataset = this.sample[0].value;
    let Ymax = d3.max(dataset);
	  let Ymin = d3.min(dataset);
    this.xScale = d3.scaleLinear().domain([0, dataset.length]).range([0, this.config.svgW]);
    this.yScale = d3.scaleLinear().domain([Ymin, Ymax]).range([this.config.svgH, 0]);
    let tickLabels = ['', '6月','7月','8月','9月','10月'];
    // 增加一個line function，用來把資料轉為x, y
    this.line = d3.line()
      .x((d,i) => {
        return this.xScale(i+1); //利用尺度運算資料索引，傳回x的位置
      })
      .y((d) => {
        return this.yScale(d); //利用尺度運算資料的值，傳回y的位置
      });
    // x,y 座標 scale
    this.xAxis = d3.axisBottom(this.xScale).ticks(5).tickFormat((d,i) => { return tickLabels[i] });
    this.yAxis = d3.axisLeft(this.yScale).tickSizeInner(-this.config.svgH);
    // 繪製座標點
    this.dots = this.svg.selectAll('g.dot')
      .data(this.dotdata())
      .enter();
  },
  rendor: function () {
    let dataset = this.sample[0].value;
    let color = d3.scaleOrdinal(d3.schemeCategory20c);
    // SVG 加入 x 軸線
    this.svg.append('g')
      .attr("transform", `translate(0, ${this.config.svgH})`)
      .attr('class', 'x axis')
      .call(this.xAxis);
    // SVG 加入 y 軸線
    this.svg.append('g')
      .attr("transform", `translate(0, 0)`)
      .attr('class', 'y axis')
      .call(this.yAxis);
    // SVG 加入 y 軸名稱
    this.svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - this.config.left)
        .attr("x",0 - (this.config.svgH / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("件數");
    // 將資料套用 d3.line()
    this.path = this.svg.append('path')
      .attr('class', '.path')
      .attr('fill', 'none')
      .attr('stroke', color(0))
      .attr('d', this.line(dataset));
    // 加入座標點
    this.dots.append('g')
      .attr('class', 'dot')
      .append("circle")
      .attr("cx",(d,i)=>{ return this.xScale(i+1); })
      .attr("cy",(d)=>{ return this.yScale(d.value); })
      .attr("r","5")
      .attr("fill", color(0));
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
