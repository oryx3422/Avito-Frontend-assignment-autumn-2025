import React from "react";
import classes from "./MyCheckbox.module.css";

const MyCheckbox = ({ label, ...props }) => {
  return (
    <label className={classes.checkboxContainer}>
      <input type="checkbox" {...props} className={classes.checkbox} />
      <span className={classes.customBox}></span>
      {label}
    </label>
  );
};

export default MyCheckbox;
