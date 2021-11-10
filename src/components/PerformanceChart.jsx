import { useEffect, useRef } from "react";
import { getUserPerformance } from "../api/query";
import { select, scalePoint, scaleLinear, axisRight, line } from "d3";
import "../css/PerformanceChart.css";

export default function PerformanceChart({ userId }) {
  const chartContainer = useRef(null);

  useEffect(async () => {
    // Fetch user performance stats
    const { data } = await getUserPerformance(userId);

    /**
     * Prepare SVG container
     */

    // Define SVG size
    const margin = 40,
      height = 260 - margin,
      width = 260 - margin,
      box = height - margin,
      radius = box / 2;

    // SVG
    const svg = select(chartContainer.current)
      .attr("width", width + margin)
      .attr("height", height + margin);

    // Clean up
    svg.selectAll("*").remove();

    // Add container
    const container = svg
      .append("g")
      .attr("transform", `translate(${margin},${margin})`);

    // Add centered container
    const center = container
      .append("g")
      .attr("transform", `translate(${radius}, ${radius})`);

    /**
     * Add background polygons
     */

    // Define scale
    const domain = [0, 50, 100, 150, 200, 250];
    const scale = scalePoint().domain(domain).range([0, radius]);

    // Add polygons
    domain.forEach((tick) => {
      // Define each tick coordinates
      const points = data.map(({ kind }) => ({
        x: scale(tick) * Math.sin(2 * Math.PI * (kind / data.length) + Math.PI),
        y: scale(tick) * Math.cos(2 * Math.PI * (kind / data.length) + Math.PI),
      }));

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
    data.forEach(({ kind }, i) => {
      const label = labels[i];
      const distance = radius + 20;

      // Position labels around polygon
      center
        .append("text")
        .text(label)
        .attr(
          "x",
          distance * Math.sin(2 * Math.PI * (kind / data.length) + Math.PI)
        )
        .attr(
          "y",
          distance * Math.cos(2 * Math.PI * (kind / data.length) + Math.PI)
        )
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
    const statScale = scaleLinear().domain([0, 250]).range([0, radius]);

    // Define stats coordinates
    const statPoints = data.map(({ value, kind }) => ({
      x:
        statScale(value) *
        Math.sin(2 * Math.PI * (kind / data.length) + Math.PI),
      y:
        statScale(value) *
        Math.cos(2 * Math.PI * (kind / data.length) + Math.PI),
    }));

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
