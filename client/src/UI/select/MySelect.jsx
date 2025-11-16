import classes from "./MySelect.module.css";

const MySelect = ({ defaultValue, options, value, onChange }) => {
  return (
    <select
      className={classes.mySelect}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option disabled value="">
        {defaultValue}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.name}
        </option>
      ))}
    </select>
  );
};

export default MySelect;
