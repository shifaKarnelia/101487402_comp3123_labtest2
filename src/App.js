import React, { useState, useEffect } from "react";
import "./App.css";

// my personal key
const API_KEY = "2b14db7354af6082c560c19cfecf30b0";

function App() {
  const [city, setCity] = useState("Toronto");
  const [weather, setWeather] = useState(null); 
  const [forecast, setForecast] = useState([]);        
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();
      setWeather(data);
      setLoading(false);      

      // fetch data
      if (data?.coord?.lat && data?.coord?.lon) {
        fetchForecast(data.coord.lat, data.coord.lon);
      }

    } catch (err) {
      console.log("Error fetching weather:", err);
      setLoading(false);
    }
  };

 
  const fetchForecast = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const data = await res.json();

      const daily = data.list
        ? data.list.filter((item) => item.dt_txt.includes("12:00:00"))
        : [];

      setForecast(daily);
    } catch (err) {
      console.log("Error fetching forecast:", err);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);


  if (loading) return <h2>Loading...</h2>;

  if (!weather) return <h2>No data yet...</h2>;

  return (
    <div className="app-container">
        <h1>Weather Forecast</h1>
      <div className="search-box">
      
        <input
          type="text"
          placeholder="Enter city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <button onClick={fetchWeather}>Search</button>
      </div>

      <div className="weather-card">
        <div className="left-today">
          <h2>{weather.name}</h2>
          <h1>{Math.round(weather.main?.temp)}°C</h1>

          <img
            src={`https://openweathermap.org/img/wn/${weather.weather?.[0]?.icon}@2x.png`}
            alt=""
          />
          <p>{weather.weather?.[0]?.description}</p>
        </div>
        <div className="right-details">
          <h3>Details</h3>
          <p><b>Humidity:</b> {weather.main?.humidity}%</p>
          <p><b>Feels Like:</b> {Math.round(weather.main?.feels_like)}°C</p>
          <p><b>Wind:</b> {weather.wind?.speed} m/s</p>
          <p><b>Visibility:</b> {weather.visibility / 1000} km</p>
        </div>
      </div>
      <h2 style={{ marginTop: "30px" }}>Weekly Forecast</h2>

      <div className="forecast-container">
        {forecast.map((day, i) => (
          <div className="forecast-box" key={i}>
            <p>{day.dt_txt.split(" ")[0]}</p>
            <img
              src={`https://openweathermap.org/img/wn/${day.weather?.[0]?.icon}.png`}
              alt=""
            />
            <p>{Math.round(day.main?.temp)}°C</p>
            <p>{day.weather?.[0]?.description}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

export default App;
