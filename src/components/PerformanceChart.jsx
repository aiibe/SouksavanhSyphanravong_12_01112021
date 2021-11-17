import { line, scaleLinear, scalePoint, select } from "d3";
import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import "../css/PerformanceChart.css";
import { getSpiderCoord } from "../helper/spiderChart";
import PerformanceData from "../models/PerformanceData";

/**
 * Display user performance chart
 * @param {{stats: Array<PerformanceData>}} param0 Performance stats
 * @returns {JSX.Element}
 */
function PerformanceChart({ stats }) {
  const chartContainer = useRef(null);

  useEffect(async () => {
    // Unless sessions available, skip drawing process
    if (!stats) return;

    // Define SVG size
    const MARGIN = 40,
      HEIGHT = 260 - MARGIN,
      WIDTH = 260 - MARGIN,
      BOX = HEIGHT - MARGIN,
      RADIUS = BOX / 2,
      OFFSET = Math.PI;

    // SVG
    const svg = select(chartContainer.current);
    svg.attr("width", WIDTH + MARGIN).attr("height", HEIGHT + MARGIN);
    svg.selectAll("*").remove(); // Clean old chart

    // Add center container
    const center = svg
      .append("g")
      .attr("transform", `translate(${RADIUS + MARGIN},${RADIUS + MARGIN})`);

    // Define scale
    const domain = [0, 50, 100, 150, 200, 250];
    const scale = scalePoint().domain(domain).range([0, RADIUS]);

    // Add inner polygons
    domain.forEach((tick) => {
      // Define each tick coordinates
      const points = stats.map((_, i) =>
        getSpiderCoord({
          radius: scale(tick),
          angle: 2 * Math.PI * ((i + 1) / stats.length),
          offset: OFFSET,
        })
      );

      // Draw each polygon
      center
        .append("path")
        .datum([...points, points[0]]) // Close the polygon path
        .attr("fill", "none")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1)
        .attr(
          "d",
          line()
            .x(({ x }) => x)
            .y(({ y }) => y)
        );
    });

    // Add text labels
    stats.forEach(({ kind }, i) => {
      // Define each text coordinates
      const { x, y } = getSpiderCoord({
        radius: RADIUS + 20,
        angle: 2 * Math.PI * ((i + 1) / stats.length),
        offset: OFFSET,
      });

      // Draw labels around polygon
      center
        .append("text")
        .text(kind)
        .attr("x", x)
        .attr("y", y)
        .attr("fill", "#fff")
        .attr("font-family", "Roboto")
        .attr("font-size", 12)
        .attr("font-weight", 500)
        .attr("text-anchor", "middle");
    });

    // Define scale
    const statScale = scaleLinear().domain([0, 250]).range([0, RADIUS]);

    // Define stats coordinates
    const statPoints = stats.map(({ value }, i) =>
      getSpiderCoord({
        radius: statScale(value),
        angle: 2 * Math.PI * ((i + 1) / stats.length),
        offset: OFFSET,
      })
    );

    // Add user stats as a polygon (red one)
    center
      .append("path")
      .datum([...statPoints, statPoints[0]]) // Close the polygon path
      .attr("fill", "rgba(255,0,0,.7)")
      .attr("d", line().x(0).y(0))
      .transition()
      .duration(1000)
      .attr(
        "d",
        line()
          .x(({ x }) => x)
          .y(({ y }) => y)
      );
  }, []);

  return (
    <div className="chart__performance">
      <svg ref={chartContainer}></svg>
    </div>
  );
}

PerformanceChart.propTypes = {
  stats: PropTypes.array.isRequired,
};

export default PerformanceChart;
