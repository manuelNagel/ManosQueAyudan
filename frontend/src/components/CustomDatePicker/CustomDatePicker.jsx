import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./CustomDatePicker.module.css"; // Archivo CSS personalizado

const CustomDatePicker = ({ id, value, onChange, placeholder = "dd/mm/aaaa" }) => {
    return (
      <div className="w-100">
        
        <DatePicker
          id={id}
          selected={value}
          onChange={onChange}
          dateFormat="dd/MM/yyyy"
          className="form-control"
          placeholderText={placeholder}
          isClearable
        />
      </div>
    );
  };
  
  export default CustomDatePicker;