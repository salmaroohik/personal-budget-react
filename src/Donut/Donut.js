import React, { useEffect } from 'react';
import * as d3 from 'd3';
import axios from 'axios';



function Donut()
{
    var dataSource = {
        datasets: [
            {
                data: [],
                backgroundColor: [
                    "#ffcd56",
                    "#ff6384",
                    "#36a2eb",
                    "#fd6b19",
                    "#AB6F62",
                    "#766D0F",
                    "#90A2F3",
                ]
            }],
        labels: []
    
    };
    useEffect(() => {
        axios.get('http://localhost:3000/budget')
        .then(res => {
          console.log(res);
          for (var i = 0; i < res.data.myBudget.length; i++) {
              dataSource.datasets[0].data[i] = res.data.myBudget[i].budget;
              dataSource.labels[i] = res.data.myBudget[i].title;
            }
          var svg = d3.select("#chart")
        .append("svg")
        .append("g")
        svg.append("g")
        .attr("class", "slices");
    svg.append("g")
        .attr("class", "labels");
    svg.append("g")
        .attr("class", "lines");
    
    var width = 960,
        height = 450,
        radius = Math.min(width, height) / 2;
    
    var pie = d3.layout.pie()
        .sort(null)
        .value(function(d) {
            return d.value;
        });
    
    var arc = d3.svg.arc()
        .outerRadius(radius * 0.8)
        .innerRadius(radius * 0.4);
    
    var outerArc = d3.svg.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9);
    
    svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    
    var key = function(d){ return d.data.label; };
    
    var color = d3.scale.ordinal()
        .domain(dataSource.labels)
        .range(dataSource.datasets[0].backgroundColor);
    
    function randomData (dataSource){
      var labels = color.domain();
      var budget_list = dataSource.datasets[0].data;
      var k =0;
        return labels.map(function(label){
            return { label: label, value: budget_list[k++] }
        });
    }
    
    change(randomData(dataSource));
    
    d3.select(".randomize")
        .on("click", function(){
            change(randomData());
        });
    
    
    function change(data) {
    
        /* ------- PIE SLICES -------*/
        var slice = svg.select(".slices").selectAll("path.slice")
            .data(pie(data), key);
    
        slice.enter()
            .insert("path")
            .style("fill", function(d) { return color(d.data.label); })
            .attr("class", "slice");
    
        slice		
            .transition().duration(1000)
            .attrTween("d", function(d) {
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    return arc(interpolate(t));
                };
            })
    
        slice.exit()
            .remove();
    
        /* ------- TEXT LABELS -------*/
    
        var text = svg.select(".labels").selectAll("text")
            .data(pie(data), key);
    
        text.enter()
            .append("text")
            .attr("dy", ".35em")
            .text(function(d) {
                return d.data.label;
            });
        
        function midAngle(d){
            return d.startAngle + (d.endAngle - d.startAngle)/2;
        }
    
        text.transition().duration(1000)
            .attrTween("transform", function(d) {
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    var d2 = interpolate(t);
                    var pos = outerArc.centroid(d2);
                    pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                    return "translate("+ pos +")";
                };
            })
            .styleTween("text-anchor", function(d){
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    var d2 = interpolate(t);
                    return midAngle(d2) < Math.PI ? "start":"end";
                };
            });
    
        text.exit()
            .remove();
    
        /* ------- SLICE TO TEXT POLYLINES -------*/
    
        var polyline = svg.select(".lines").selectAll("polyline")
            .data(pie(data), key);
        
        polyline.enter()
            .append("polyline");
    
        polyline.transition().duration(1000)
            .attrTween("points", function(d){
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    var d2 = interpolate(t);
                    var pos = outerArc.centroid(d2);
                    pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                    return [arc.centroid(d2), outerArc.centroid(d2), pos];
                };			
            });
        
        polyline.exit()
            .remove();
    };


            })
          })
          return (
            <div>
              
            </div>
          );



}

export default Donut;


























/* import React, { useRef, useState, useEffect } from "react";
import * as d3 from "d3";
import { getChartData } from "../Data";


const Donut = () => {
  const [data, setData] = useState({
    title: [],
    budget: [],
  });
  const chartRef = useRef(null);

  const width = 500;
  const height = 500;
  const black = "#333333";
  const margin = 40;
  const radius = Math.min(width, height) / 2 - margin;


  const getData = () => {
    getChartData().then((res) => {
      createChart(res.data.myBudget);
      setData({
        title: res.data.myBudget.map((res) => {
          return res.title;
        }),
        budget: res.data.myBudget.map((res) => {
          return res.budget;
        }),
      });
    });
  };

  const { title } = data;
  const getMidAngle = (d) => d.startAngle + (d.endAngle - d.startAngle) / 2;

  const createChart = (data) => {
    let colors = d3
      .scaleOrdinal()
      .domain(title)
      .range([
        '#ffcd56',
        '#ff6384',
        '#ff0000',
        '#ff00ff',
        '#00ff00',
        '#0000ff',
        '#00ccff'
      ]);
    let pie = d3.pie().value((d) => d.budget)(data);

    var arc = d3
      .arc()
      .outerRadius(radius * 0.7)
      .innerRadius(radius * 0.4);

    var outerArc = d3
      .arc()
      .outerRadius(radius * 0.9)
      .innerRadius(radius * 0.9);

    var svg = d3
      .select(chartRef.current)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    svg
      .selectAll("allSlices")
      .data(pie)
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => colors(d.data.title))
      .attr("stroke", "white")
      .style("stroke-width", "2px")
      .style("opacity", 0.7);

    svg
      .selectAll("allPolylines")
      .data(pie)
      .enter()
      .append("polyline")
      .attr("stroke", black)
      .attr("stroke-width", 1)
      .style("fill", "none")
      .attr("points", (d) => {
        var posA = arc.centroid(d);
        var posB = outerArc.centroid(d);
        var posC = outerArc.centroid(d);
        var midAngle = getMidAngle(d);
        posC[0] = radius * 0.95 * (midAngle < Math.PI ? 1 : -1);
        return [posA, posB, posC];
      });
    svg
      .selectAll("allLabels")
      .data(pie)
      .enter()
      .append("text")
      .text((d) => d.data.title)
      .attr("transform", (d) => {
        var pos = outerArc.centroid(d);
        var midAngle = getMidAngle(d);
        pos[0] = radius * 0.99 * (midAngle < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .style("text-anchor", (d) => {
        var midAngle = getMidAngle(d);
        return midAngle < Math.PI ? "start" : "end";
      });
  };



  useEffect(() => {
    getData();
  }, []);

  return <figure ref={chartRef}></figure>;
};

export default Donut;
 */




/* function PieChart(props) {
  const {
    data,
    outerRadius,
    innerRadius,
  } = props;
  const margin = {
    top: 50, right: 50, bottom: 50, left: 50,
  };
  const width = 2 * outerRadius + margin.left + margin.right;
  const height = 2 * outerRadius + margin.top + margin.bottom;

  const colorScale = d3     
    .scaleSequential()      
    .interpolator(d3.interpolateCool)      
    .domain([0, data.length]);

  useEffect(() => {
    drawChart();
  }, [data]);

  function drawChart() {
    // draw the chart here
        // Remove the old svg
        d3.select('#pie-container')
        .select('svg')
        .remove();
  
      // Create new svg
      const svg = d3
        .select('#pie-container')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);
  
      const arcGenerator = d3
        .arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);
  
      const pieGenerator = d3
        .pie()
        .padAngle(0)
        .value((d) => d.value);
  
      const arc = svg
        .selectAll()
        .data(pieGenerator(data))
        .enter();
  
      // Append arcs
      arc
        .append('path')
        .attr('d', arcGenerator)
        .style('fill', (_, i) => colorScale(i))
        .style('stroke', '#ffffff')
        .style('stroke-width', 0);
  
      // Append text labels
      arc
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')
        .text((d) => d.data.label)
        .style('fill', (_, i) => colorScale(data.length - i))
        .attr('transform', (d) => {
          const [x, y] = arcGenerator.centroid(d);
          return `translate(${x}, ${y})`;
        });
  }    

  return <div id="pie-container" />;
}

export default PieChart; */