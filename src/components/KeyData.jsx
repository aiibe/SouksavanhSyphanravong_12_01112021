import PropTypes from "prop-types";
import "../css/KeyData.css";

function KeyData({ title, count, unit, bgColor = "rgb(0,0,0)", children }) {
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

KeyData.propTypes = {
  title: PropTypes.any.isRequired,
  count: PropTypes.number.isRequired,
  unit: PropTypes.any.isRequired,
  bgColor: PropTypes.string,
};

export default KeyData;
