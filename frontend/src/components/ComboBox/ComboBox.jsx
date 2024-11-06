import React, { useState } from "react";

const ComboBox = ({ title, options, defaultTitle,value,onChange, disabled }) => {
  const [selectedOption, setSelectedOption] = useState(defaultTitle);

  const handleSelect = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    // <div>
    //   <title>{title}</title>
    //   <select value={selectedOption} onChange={handleSelect}>
    //     <option disabled>{defaultTitle}</option>
        
    //         {options.map((option) => (
    //       <option key={option.isoCode} value={option.isoCode}>
    //         {option.name}
    //       </option>
    //     ))}
    //   </select>
    // </div>
    <select
    className="form-control" // Adds the Bootstrap form control styling
    value={value || ""}
    //onChange={(event) => onChange(alert(ComboBox.value))}
    onChange={(event) => onChange(event.target.value)}
    disabled={disabled}
  >
    <option value="" disabled>
      {defaultTitle}
    </option>
    {options.map((option) => (
      <option key={option.isoCode} value={option.isoCode}>
        {option.name}
      </option>
    ))}
  </select>
  );
};

export default ComboBox;
