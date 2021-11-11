import { useEffect, useRef } from "react";
import { select, arc, interpolate } from "d3";
import "../css/ScoreChart.css";

export default function ScoreChart({ score = 12 }) {
  const chartContainer = useRef(null);

  useEffect(() => {
    // Size
    const MARGIN = 40,
      HEIGHT = 260 - MARGIN,
      WIDTH = 260 - MARGIN,
      RADIUS = (HEIGHT - MARGIN) / 2;

    // SVG
    const svg = select(chartContainer.current);

    // Clean old drawing
    svg.select("*").remove();

    // Style SVG
    svg
      .attr("width", WIDTH + MARGIN)
      .attr("height", HEIGHT + MARGIN)
      .attr("font-family", "Roboto");

    // Center
    const center = svg
      .append("g")
      .attr("transform", `translate(${RADIUS + MARGIN}, ${RADIUS + MARGIN})`);

    // Add circle
    center.append("circle").attr("r", RADIUS).attr("fill", "#fff");

    /**
     * Add arc progression
     */

    // Define arc
    const arcProgress = arc()
      .innerRadius(RADIUS)
      .outerRadius(RADIUS + 10)
      .startAngle(0)
      .cornerRadius(20);

    // Define angle based on score
    const angle = score * (2 * Math.PI);

    // Draw arc
    center
      .append("path")
      .attr("fill", "red")
      .datum({ endAngle: 0 })
      .attr("d", arcProgress)
      .transition()
      .duration(1000)
      .attrTween("d", (d) => {
        const interpolator = interpolate(d.endAngle, -angle);
        return (t) => {
          d.endAngle = interpolator(t);
          return arcProgress(d);
        };
      });
  }, []);

  return (
    <div className="chart__score">
      <span>Score</span>
      <div className="score__indicator">
        <h2>{score * 100}%</h2>
        <p>de votre objectif</p>
      </div>
      <svg ref={chartContainer}></svg>
    </div>
  );
}
