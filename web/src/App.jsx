import { useState } from 'react';
import countryData from './data/country_codes.json';
import stateData from './data/state_codes.json'; 
import retrieveData from './apicall.jsx';

function App() {
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [unit, setUnit] = useState("metric");

  function handleChange(e) {
    setCity(e.target.value);
  }

  function countryNameToCode(name) {
    const countryObj = countryData.find((item) => item.country === name);
    return countryObj ? countryObj.code : "";
  }

  function Button({ text, onClick }) {
    return (
        <button 
            onClick={onClick} 
            style={{
                padding: '10px 20px',
                fontSize: '16px',
                backgroundColor: '#1d7db9',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
            }}
        >
            {text}
        </button>
    );
}

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setResult(retrieveData(countryNameToCode(country), city, unit, state));
    setLoading(false);
    // Reset all fields after submission
    setCity("");
    setCountry("");
    setState("");
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
      <div>
        <label>Select Unit:
          <Button 
            text={unit === "metric" ? "Metric (°C)" : "Imperial (°F)"} 
            onClick={() => setUnit(unit === "metric" ? "imperial" : "metric")} 
          />
        </label>
      </div>
      <div>
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
      </div>
      <div>
        <label>Enter your city:
          <input
            type="text" 
            value={city}
            onChange={handleChange}
          />
        </label>
      </div>
      <input type="submit" />
      {loading && <p>Loading...</p>}
      {result && (
        <div>
          <h3>Result</h3>
          {result}
        </div>
      )}
    </form>
  )
}

export default App;
