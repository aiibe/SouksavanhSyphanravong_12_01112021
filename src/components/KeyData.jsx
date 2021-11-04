import "../css/KeyData.css";

export default function KeyData({
  title,
  count,
  unit,
  children,
  rgb = [0, 0, 0],
}) {
  // Set transparency to parent element of icon
  function setColorTransparency() {
    return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.06)`;
  }

  return (
    <div className="key__block">
      <div
        className="key__icon"
        style={{ backgroundColor: setColorTransparency() }}
      >
        {children}
      </div>
      <div className="key__info">
        <h3>
          {count}
          {unit}
        </h3>
        <small>{title}</small>
      </div>
    </div>
  );
}
