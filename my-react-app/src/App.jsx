import { useState } from 'react';
import countryData from '..\\data\\country_codes.json';
import stateData from '..\\data\\state_codes.json'; 

function App() {
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");

  function handleChange(e) {
    setCity(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    alert(city);
  }

  function CountriesList() {
    return countryData.map((item) => (
      <option key={item.code} value={item.country}>
        {item.country}
      </option>
    ));
  }

  function StatesList() {
    return stateData.map((item) => (
      <option key={item.code} value={item.state}>
        {item.state}
      </option>
    ));
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Enter your country:
        <select value={country} onChange={(e) => setCountry(e.target.value)}>
          <option value="">Select your country...</option>
          <CountriesList />
        </select>
      </label>
      {country === "United States" && (
        <label>Enter your state (US only):
          <select value={state} onChange={(e) => setState(e.target.value)}>
            <option value="">Select your state...</option>
            <StatesList />
          </select>
        </label>
      )}
      <label>Enter your city:
        <input
          type="text" 
          value={city}
          onChange={handleChange}
        />
      </label>
      <input type="submit" />
    </form>
  )
}

export default App;
