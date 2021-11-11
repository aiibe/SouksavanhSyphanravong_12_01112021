import { useEffect, useRef } from "react";
import {
  select,
  scaleLinear,
  line,
  scalePoint,
  axisBottom,
  curveCardinal,
} from "d3";
import { getUserSession } from "../api/query";
import "../css/SessionChart.css";

export default function SessionChart({ userId }) {
  const chartContainer = useRef(null);

  useEffect(async () => {
    // Fetch user sessions
    const { sessions } = await getUserSession(userId);

    // Tranform data structure
    const days = ["L", "M", "M", "J", "V", "S", "D"];
    const durations = sessions.map(({ sessionLength }) => sessionLength);
    const userSession = sessions.map((s, i) => ({ ...s, letter: days[i] }));

    // Define margins and size for chart
    const marginBottom = 60;
    const width = 260;
    const height = 260 - marginBottom;

    // Define y scale
    const yScale = scaleLinear()
      .domain([Math.min(...durations), Math.max(...durations)])
      .range([height / 2, 0]);

    // Define x scale
    const xScale = scalePoint()
      .domain(userSession)
      .range([0, width])
      .padding(0.5);
    const xGenerate = axisBottom(xScale)
      .ticks(7)
      .tickFormat((_, i) => days[i]);

    // Start drawing user sessions chart

    // SVG container
    const svg = select(chartContainer.current);
    // Clean up
    svg.selectAll("*").remove();

    // Set SVG size
    svg.attr("width", width).attr("height", height + marginBottom);

    // Add x axis
    const xContainer = svg
      .append("g")
      .call(xGenerate)
      .attr("transform", `translate(0, ${height})`);

    // Remove domain path and ticks
    xContainer.select(".domain").remove();
    xContainer.selectAll(".tick line").remove();

    // Style days text/labels
    xContainer
      .selectAll("g text")
      .attr("transform", `translate(0, 30)`)
      .attr("font-family", "Roboto")
      .attr("font-size", 12)
      .attr("fill", "rgba(255,255,255, 0.6)");

    // Add line
    svg
      .append("g")
      .attr("class", "line")
      .selectAll(".line")
      .data([userSession])
      .join("path")
      .attr("fill", "none")
      .attr("stroke-width", 2)
      .attr("stroke", "#fff")
      .attr("transform", `translate(0, ${height - height / 2})`)
      .attr(
        "d",
        line()
          .x(xScale)
          .y(yScale(Math.min(...durations)))
          .curve(curveCardinal.tension(0.1))
      )
      .transition()
      .duration(1000)
      .attr(
        "d",
        line()
          .x(xScale)
          .y(({ sessionLength }) => yScale(sessionLength))
          .curve(curveCardinal.tension(0.1))
      );

    // Add background shadow
    svg
      .append("g")
      .attr("class", "bg-shadow")
      .selectAll("rect")
      .data(userSession)
      .join("rect")
      .attr("height", height + marginBottom)
      .attr("width", width)
      .attr("fill", "rgba(0,0,0,0.1)")
      .attr("transform", (s) => `translate(${xScale(s)}, 0)`)
      .attr("opacity", 0)
      .on("mouseover", function (event, data) {
        select(this).attr("opacity", 1);
        select(`.data-point-${data.day}`).attr("opacity", 1);
      })
      .on("mouseout", function (event, data) {
        select(this).attr("opacity", 0);
        select(`.data-point-${data.day}`).attr("opacity", 0);
      });

    // Add points
    const pointContainer = svg
      .append("g")
      .attr("class", "points")
      .selectAll("circle")
      .data(userSession)
      .join("g")
      .attr("class", (data) => `data-point-${data.day}`)
      .attr("opacity", 0)
      .attr(
        "transform",
        (s) =>
          `translate(${xScale(s)}, ${
            height - height / 2 + yScale(s.sessionLength)
          })`
      );

    pointContainer
      .append("circle")
      .attr("class", "points")
      .attr("fill", "rgb(255,255,255)")
      .attr("stroke", "rgba(255,255,255, .3)")
      .attr("stroke-width", 10)
      .attr("r", 4);

    // Add tooltips
    const tooltips = pointContainer
      .append("g")
      .attr("class", "tooltip")
      .attr(
        "transform",
        (_, i) => `translate(${i === userSession.length - 1 ? -50 : 10}, -40)`
      );

    tooltips
      .append("rect")
      .attr("width", 40)
      .attr("height", 26)
      .attr("fill", "#fff");

    tooltips
      .append("text")
      .text((d) => `${d.sessionLength} min`)
      .attr("transform", `translate(20,13)`)
      .attr("dominant-baseline", "middle")
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .attr("font-family", "Roboto")
      .attr("font-size", 8)
      .attr("font-weight", "500");
  }, []);

  return (
    <div className="chart__session">
      <div className="session__title">
        <h2>Durée moyenne des sessions</h2>
      </div>
      <svg ref={chartContainer}></svg>
    </div>
  );
}