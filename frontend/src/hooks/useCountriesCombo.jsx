import { useState, useEffect } from "react";
import axios from 'axios';

const useCountriesCombo = () => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    // Simulate an API call or data fetching
    const fetchOptions = async () => {
      const data = ["Option 1", "Option 2", "Option 3"]; // Replace with real data fetch
      setOptions(data);
    };

    fetchOptions();
  }, []);

  return options;
};

export default useCountriesCombo;
