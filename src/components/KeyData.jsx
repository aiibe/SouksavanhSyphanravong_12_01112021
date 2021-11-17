import PropTypes from "prop-types";
import "../css/KeyData.css";

/**
 * KeyData
 * @param {{title: string, count: number, unit: string, bgColor: string, children: JSX.Element}} param0
 * @returns {JSX.Element}
 */
function KeyData({ title, count, unit, bgColor = "rgb(0,0,0)", children }) {
  return (
    <div className="key__block">
      <div className="key__icon" style={{ backgroundColor: bgColor }}>
        {children}
      </div>
      <div className="key__info">
        <h3>
          {count.toLocaleString()}
          {unit}
        </h3>
        <small>{title}</small>
      </div>
    </div>
  );
}

KeyData.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  unit: PropTypes.string.isRequired,
  bgColor: PropTypes.string,
};

export default KeyData;
