import React, { useState, useEffect, useCallback } from 'react';

import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css'; // Bootstrap icons
import SearchBox from './components/SearchBox';
import WeatherInfo from './components/WeatherInfo';
import Forecast from './components/Forecast';
import Favorites from './components/Favorites';
import SearchHistory from './components/SearchHistory';
import ChatWidget from './components/ChatWidget';

export default function App() {
  const [city, setCity] = useState("Mumbai");
  const [weather, setWeather] = useState({});
  const [forecast, setForecast] = useState([]);
  const [unit, setUnit] = useState("metric");
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);

  const fetchWeather = useCallback(async (searchCity) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&units=${unit}&appid=9e42475700786e1fa0cdb019f1cd0891`
    );
    setWeather(response.data);
    setCity(searchCity);
    setHistory((prev) => [searchCity, ...prev.filter((c) => c !== searchCity)]);
  } catch (err) {
    alert("City not found!");
  }
}, [unit]);

const fetchForecast = useCallback(async (searchCity) => {
  try {
    const res = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${searchCity}&units=${unit}&appid=9e42475700786e1fa0cdb019f1cd0891`
    );
    const daily = res.data.list.filter((_, index) => index % 8 === 0);
    setForecast(daily);
  } catch (err) {
    console.error("Error fetching forecast:", err);
  }
}, [unit]);


  useEffect(() => {
  fetchWeather(city);
  fetchForecast(city);
}, [city, unit, fetchWeather, fetchForecast]);


  const toggleUnit = () => {
    setUnit((prev) => (prev === "metric" ? "imperial" : "metric"));
  };

  const addToFavorites = () => {
    if (!favorites.includes(city)) {
      setFavorites([...favorites, city]);
    }
  };


  return (
    <div className="container mt-3 p-3 bg-light shadow">
      <div className='row justify-content-center text-algn-center'>
        <div className=" col-8">
          <h2>🌦️ Weather Dashboard</h2>
          <SearchBox onSearch={fetchWeather} />
          {weather?.main && (
            <>
              <WeatherInfo
                unit={unit}
                weather={weather}
                onToggleUnit={toggleUnit}
                onAddToFavorites={addToFavorites}
                />
              <Forecast forecast={forecast} unit={unit} />
            </>
          )}
        </div>
        <div className='col-3'>
          <Favorites favorites={favorites} onSelect={fetchWeather} />
          <SearchHistory history={history} onSelect={fetchWeather} />
        </div>
      </div>
      <ChatWidget weather={weather} city={city} />
    </div>
  );
}
