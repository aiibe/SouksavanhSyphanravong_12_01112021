import "../css/KeyData.css";

export default function KeyData({
  title,
  count,
  unit,
  bgColor = "rgb(0,0,0)",
  children,
}) {
  return (
    <div className="key__block">
      <div className="key__icon" style={{ backgroundColor: bgColor }}>
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
