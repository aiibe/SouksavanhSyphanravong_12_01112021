import {
  axisBottom,
  curveCardinal,
  line,
  scaleLinear,
  scalePoint,
  select,
} from "d3";
import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import "../css/SessionChart.css";
import Session from "../models/Session";

/**
 * Display user session chart
 * @param {{session: Session}} param0 Session instance
 * @returns {JSX.Element}
 */
function SessionChart({ session }) {
  const chartContainer = useRef(null);

  useEffect(async () => {
    // Unless sessions available, skip drawing process
    if (!session) return;

    const userSession = session.getSessions();

    // Define margins and size for chart
    const MARGIN = 60;
    const WIDTH = 267;
    const HEIGHT = 267 - MARGIN;

    // Select SVG
    const svg = select(chartContainer.current);
    svg.attr("width", WIDTH).attr("height", HEIGHT + MARGIN);
    svg.selectAll("*").remove(); // Clean old chart

    // Define x scale for points
    const xScale = scalePoint()
      .domain(userSession)
      .range([0, WIDTH])
      .padding(0.5);

    // Generate axis
    const xGenerate = axisBottom(xScale)
      .ticks(7)
      .tickFormat(({ letter }) => letter);

    // Apply axis
    const xContainer = svg
      .append("g")
      .call(xGenerate)
      .attr("transform", `translate(0, ${HEIGHT})`);

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

    // Define y axis scale
    const durations = session.getDurations();
    const yScale = scaleLinear()
      .domain([Math.min(...durations), Math.max(...durations)])
      .range([HEIGHT / 2, 0]);

    // Translate group to the left by this offset
    const offset = WIDTH / userSession.length;

    // Overflow sessions
    const overSessions = session.getOverSessions();

    // Define another x scale (overflowed)
    const xScaleOver = scalePoint()
      .domain(overSessions)
      .range([0, WIDTH + offset * 2])
      .padding(0.5);

    // Draw line
    svg
      .append("g")
      .datum(overSessions)
      .append("path")
      .attr("fill", "none")
      .attr("stroke-width", 2)
      .attr("stroke", "#fff")
      .attr("transform", `translate(-${offset}, ${HEIGHT - HEIGHT / 2})`)
      .attr(
        "d",
        line()
          .x(xScaleOver)
          .y(yScale(Math.min(...durations)))
          .curve(curveCardinal.tension(0.1))
      )
      .transition()
      .duration(1000)
      .attr(
        "d",
        line()
          .x(xScaleOver)
          .y(({ sessionLength }) => yScale(sessionLength))
          .curve(curveCardinal.tension(0.1))
      );

    // Add background rectangles
    svg
      .append("g")
      .attr("class", "bg-shadow")
      .selectAll("rect")
      .data(userSession)
      .join("rect")
      .attr("height", HEIGHT + MARGIN)
      .attr("width", WIDTH)
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
            HEIGHT - HEIGHT / 2 + yScale(s.sessionLength)
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
        (_, i) => `translate(${i === userSession.length - 1 ? -50 : 10}, -40)` // last tooltip flips to the left
      );

    tooltips
      .append("rect")
      .attr("width", 40)
      .attr("height", 26)
      .attr("fill", "#fff");

    tooltips
      .append("text")
      .text(({ sessionLength }) => `${sessionLength} min`)
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

SessionChart.propTypes = {
  session: PropTypes.object.isRequired,
};

export default SessionChart;
