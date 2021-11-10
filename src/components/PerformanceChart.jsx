import { useEffect, useRef } from "react";
import { getUserPerformance } from "../api/query";
import { select, scalePoint, scaleLinear, line } from "d3";
import "../css/PerformanceChart.css";
import { getSpiderCoord } from "../helper/spiderChart";

export default function PerformanceChart({ userId }) {
  const chartContainer = useRef(null);

  useEffect(async () => {
    // Fetch user performance stats
    const { data } = await getUserPerformance(userId);

    /**
     * Prepare SVG container
     */

    // Define SVG size
    const MARGIN = 40,
      HEIGHT = 260 - MARGIN,
      width = 260 - MARGIN,
      BOX = HEIGHT - MARGIN,
      RADIUS = BOX / 2,
      OFFSET = Math.PI;

    // SVG
    const svg = select(chartContainer.current)
      .attr("width", width + MARGIN)
      .attr("height", HEIGHT + MARGIN);

    // Clean up
    svg.selectAll("*").remove();

    // Add container
    const container = svg
      .append("g")
      .attr("transform", `translate(${MARGIN},${MARGIN})`);

    // Add centered container
    const center = container
      .append("g")
      .attr("transform", `translate(${RADIUS}, ${RADIUS})`);

    /**
     * Add background polygons
     */

    // Define scale
    const domain = [0, 50, 100, 150, 200, 250];
    const scale = scalePoint().domain(domain).range([0, RADIUS]);

    // Add polygons
    domain.forEach((tick) => {
      // Define each tick coordinates
      const points = data.map((_, i) =>
        getSpiderCoord({
          radius: scale(tick),
          angle: 2 * Math.PI * ((i + 1) / data.length),
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

    /**
     * Add labels
     */

    // Translated labels to French
    const labels = [
      "Cardio",
      "Energie",
      "Endurance",
      "Force",
      "Vitesse",
      "Intensité",
    ];

    // Add text labels
    data.forEach((_, i) => {
      const label = labels[i];
      const { x, y } = getSpiderCoord({
        radius: RADIUS + 20,
        angle: 2 * Math.PI * ((i + 1) / data.length),
        offset: OFFSET,
      });

      // Position labels around polygon
      center
        .append("text")
        .text(label)
        .attr("x", x)
        .attr("y", y)
        .attr("fill", "#fff")
        .attr("font-family", "Roboto")
        .attr("font-size", 12)
        .attr("font-weight", 500)
        .attr("text-anchor", "middle");
    });

    /**
     * Add user stats as a polygon (red one)
     */

    // Define scale
    const statScale = scaleLinear().domain([0, 250]).range([0, RADIUS]);

    // Define stats coordinates
    const statPoints = data.map(({ value }, i) =>
      getSpiderCoord({
        radius: statScale(value),
        angle: 2 * Math.PI * ((i + 1) / data.length),
        offset: OFFSET,
      })
    );

    // Draw stats polygon
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
