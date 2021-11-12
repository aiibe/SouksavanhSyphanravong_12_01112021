import { axisBottom, axisRight, scaleBand, scaleLinear, select } from "d3";
import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import { getUserActivity } from "../api/query";
import "../css/ActivityChart.css";

function ActivityChart({ userId }) {
  const chartContainer = useRef(null);

  useEffect(async () => {
    // Fetch data
    const { sessions } = await getUserActivity(userId);
    const userWeights = sessions.map(({ kilogram }) => parseInt(kilogram));
    const userCalories = sessions.map(({ calories }) => parseInt(calories));

    // Define margins and size for chart
    const margin = 50;
    const width = 860 - margin * 2;
    const height = 280 - margin * 2;

    // Define scale X
    const xScale = scaleBand()
      .domain(sessions.map((_, index) => index + 1))
      .range([0, width])
      .padding(0.01);

    // Define scale Y based on user weights
    const yScale = scaleLinear()
      .domain([Math.min(...userWeights) - 1, Math.max(...userWeights) + 1])
      .range([height, 0]);

    // Axis generators
    const xGenerate = axisBottom(xScale).ticks(sessions.length).tickSize(0);
    const yGenerate = axisRight(yScale).ticks(3).tickSize(-width); // dashed bars

    // SVG
    const svg = select(chartContainer.current);

    // Clean up
    svg.selectAll("*").remove();

    // Set SVG size
    svg.attr("width", width + margin * 2).attr("height", height + margin * 2);

    // Add container with margins included
    let container = svg
      .append("g")
      .attr("class", "inner")
      .attr("transform", `translate(${margin - 20},${margin})`);

    // Add x axis
    const xAxis = container
      .append("g")
      .attr("class", "x-axis")
      .call(xGenerate)
      .attr("transform", `translate(0, ${height})`);

    // Style line x axis
    xAxis.select(".domain").attr("stroke", "#DEDEDE");

    // Style text x axis
    xAxis
      .selectAll(".tick text")
      .attr("transform", `translate(0, 20)`)
      .attr("font-family", "Roboto")
      .attr("font-size", 14)
      .attr("font-weight", 500)
      .attr("fill", "#9B9EAC");

    // Add y axis
    const yAxis = container
      .append("g")
      .attr("class", "y-axis")
      .call(yGenerate)
      .attr("transform", `translate(${width}, 0)`);

    // Remove vertical line y axis
    yAxis.select(".domain").remove();

    // Style ticks
    yAxis
      .selectAll(".tick line")
      .attr("stroke-dasharray", 2)
      .attr("stroke", "#dedede");

    // Style text y axis
    yAxis
      .selectAll(".tick text")
      .attr("transform", `translate(20, 0)`)
      .attr("font-family", "Roboto")
      .attr("font-size", 14)
      .attr("font-weight", 500)
      .attr("fill", "#9B9EAC");

    // Prepare container for user data
    const groups = container
      .append("svg")
      .attr("height", height)
      .selectAll("g")
      .data(sessions)
      .join("g")
      .attr("class", "user-data")
      .attr("transform", function (_, i) {
        return `translate(${xScale(i + 1)}, 0)`;
      });

    // Display user weights as bars
    groups
      .append("rect")
      .attr("y", ({ kilogram }) => yScale(kilogram))
      .attr("width", 10)
      .attr("height", ({ kilogram }) => height - yScale(kilogram) + 10)
      .attr("rx", 5)
      .attr("ry", 5)
      .attr("transform", `translate(${xScale.bandwidth() / 3}, ${height})`)
      .style("fill", "#282D30")
      .transition()
      .duration(1000)
      .attr("transform", `translate(${xScale.bandwidth() / 3},0)`);

    // Define calorie scale
    const calScale = scaleLinear()
      .domain([Math.min(...userCalories) - 50, Math.max(...userCalories) + 50])
      .range([height, 0]);

    // Display user calories as bars
    groups
      .append("rect")
      .attr("y", ({ calories }) => calScale(calories))
      .attr("width", 10)
      .attr("height", ({ calories }) => height - calScale(calories) + 10)
      .attr("rx", 5)
      .attr("ry", 5)
      .style("fill", "#E60000")
      .attr(
        "transform",
        `translate(${(xScale.bandwidth() * 2) / 3 - 10}, ${height})`
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
      .attr("height", height)
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
  userId: PropTypes.number.isRequired,
};

export default ActivityChart;
