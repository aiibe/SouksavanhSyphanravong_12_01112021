import { axisBottom, axisRight, scaleBand, scaleLinear, select } from "d3";
import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import "../css/ActivityChart.css";
import Activity from "../models/Activity";

/**
 * Display user activity chart
 * @param {{activity: Activity}} props  Activity instance
 * @returns {JSX.Element}
 */
function ActivityChart(props) {
  const chartContainer = useRef(null);

  useEffect(() => {
    const sessions = props.activity.getSessions();

    // Unless sessions available, skip drawing process
    if (!sessions) return;

    // Define MARGINs and size for chart
    const MARGIN = 50;
    const WIDTH = 860 - MARGIN * 2;
    const HEIGHT = 280 - MARGIN * 2;

    // Select SVG
    const svg = select(chartContainer.current);
    svg.attr("width", WIDTH + MARGIN * 2).attr("height", HEIGHT + MARGIN * 2);
    svg.selectAll("*").remove(); // Clean up old chart

    // Add container
    let container = svg
      .append("g")
      .attr("class", "inner")
      .attr("transform", `translate(${MARGIN - 20},${MARGIN})`);

    // Define scale for x axis
    const xScale = scaleBand()
      .domain(sessions.map((_, index) => index + 1)) // Display 1 to sessions.length under axis
      .range([0, WIDTH])
      .padding(0.01);

    // Generate axis with ticks
    const xGenerate = axisBottom(xScale).ticks(sessions.length).tickSize(0);

    // Apply axis
    const xAxis = container
      .append("g")
      .attr("class", "x-axis")
      .call(xGenerate)
      .attr("transform", `translate(0, ${HEIGHT})`);

    // Style x axis line
    xAxis.select(".domain").attr("stroke", "#DEDEDE");

    // Style x axis texts
    xAxis
      .selectAll(".tick text")
      .attr("transform", `translate(0, 20)`)
      .attr("font-family", "Roboto")
      .attr("font-size", 14)
      .attr("font-weight", 500)
      .attr("fill", "#9B9EAC");

    // Define scale for y axis based on user weights
    const weights = props.activity.getWeights();
    const yScale = scaleLinear()
      .domain([Math.min(...weights) - 1, Math.max(...weights) + 1])
      .range([HEIGHT, 0]);

    // Generate axis
    const yGenerate = axisRight(yScale).ticks(3).tickSize(-WIDTH); // dashed bars

    // Apply axis
    const yAxis = container
      .append("g")
      .attr("class", "y-axis")
      .call(yGenerate)
      .attr("transform", `translate(${WIDTH}, 0)`);

    // Remove line y axis
    yAxis.select(".domain").remove();

    // Style y axis ticks as background dotted lines
    yAxis
      .selectAll(".tick line")
      .attr("stroke-dasharray", 2)
      .attr("stroke", "#dedede");

    // Style y axis texts
    yAxis
      .selectAll(".tick text")
      .attr("transform", `translate(20, 0)`)
      .attr("font-family", "Roboto")
      .attr("font-size", 14)
      .attr("font-weight", 500)
      .attr("fill", "#9B9EAC");

    // Prepare containers each session data
    const groups = container
      .append("svg")
      .attr("height", HEIGHT)
      .selectAll("g")
      .data(sessions)
      .join("g")
      .attr("class", "user-data")
      .attr("transform", (_, i) => `translate(${xScale(i + 1)}, 0)`);

    // Display user weights as bars
    groups
      .append("rect")
      .attr("y", ({ kilogram }) => yScale(kilogram))
      .attr("width", 10)
      .attr("height", ({ kilogram }) => HEIGHT - yScale(kilogram) + 10)
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("transform", `translate(${xScale.bandwidth() / 3}, ${HEIGHT})`)
      .style("fill", "#282D30")
      .transition()
      .duration(1000)
      .attr("transform", `translate(${xScale.bandwidth() / 3},0)`);

    // Define calorie scale
    const calories = props.activity.getCalories();
    const calScale = scaleLinear()
      .domain([Math.min(...calories) - 50, Math.max(...calories) + 50])
      .range([HEIGHT, 0]);

    // Display user calories as bars
    groups
      .append("rect")
      .attr("y", ({ calories }) => calScale(calories))
      .attr("width", 10)
      .attr("height", ({ calories }) => HEIGHT - calScale(calories) + 10)
      .attr("rx", 5)
      .attr("ry", 5)
      .style("fill", "#E60000")
      .attr(
        "transform",
        `translate(${(xScale.bandwidth() * 2) / 3 - 10}, ${HEIGHT})`
      )
      .transition()
      .duration(1300)
      .attr("transform", `translate(${(xScale.bandwidth() * 2) / 3 - 10},0)`);

    // Set background bars
    const bgBars = groups
      .append("g")
      .attr("class", "bg-bars")
      .attr("opacity", 0)
      .on("mouseover", function () {
        select(this).attr("opacity", 1);
      })
      .on("mouseout", function () {
        select(this).attr("opacity", 0);
      });

    // Display background bars on hover
    bgBars
      .append("rect")
      .attr("class", "hover-bar")
      .attr("width", xScale.bandwidth())
      .attr("height", HEIGHT)
      .attr("fill", "rgba(196,196,196, 0.3)");

    // Tooltip container
    const tooltip = bgBars
      .append("g")
      .attr("class", "tooltip")
      .attr("transform", `translate(${xScale.bandwidth() - 20}, 0)`);

    // Tooltip background
    tooltip
      .append("rect")
      .attr("width", 40)
      .attr("height", 60)
      .attr("fill", "#e60000");

    // Tooltip text weight
    tooltip
      .append("text")
      .text(({ kilogram }) => kilogram + "kg")
      .attr("font-family", "Roboto")
      .attr("font-weight", 500)
      .attr("font-size", 7)
      .attr("fill", "#fff")
      .attr("text-anchor", "middle")
      .attr("transform", "translate(20, 20)");

    // // Tooltip text calorie
    tooltip
      .append("text")
      .text(({ calories }) => calories + "kCal")
      .attr("font-family", "Roboto")
      .attr("font-weight", 500)
      .attr("font-size", 7)
      .attr("fill", "#fff")
      .attr("text-anchor", "middle")
      .attr("transform", "translate(20, 40)");
  }, []);

  return (
    <div className="chart__activity">
      <div className="activity__title">
        <h2>Activité quotidienne</h2>
        <ul className="activity__legend">
          <li>Poids (kg)</li>
          <li>Calories brûlées (kCal)</li>
        </ul>
      </div>
      <svg ref={chartContainer}></svg>
    </div>
  );
}

ActivityChart.propTypes = {
  activity: PropTypes.object.isRequired,
};

export default ActivityChart;
