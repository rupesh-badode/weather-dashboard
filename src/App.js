import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import { motion, AnimatePresence } from "framer-motion"; // Animation library
import SearchBox from './components/SearchBox';
import WeatherInfo from './components/WeatherInfo';
import Forecast from './components/Forecast';
import Favorites from './components/Favorites';
import SearchHistory from './components/SearchHistory';
import ChatWidget from './components/ChatWidget';
import './App.css'; // Custom styles import

export default function App() {
  const [city, setCity] = useState("Mumbai");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [unit, setUnit] = useState("metric");
  const [favorites, setFavorites] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_KEY = "9e42475700786e1fa0cdb019f1cd0891"; // Better to move to .env in real project

  // Consolidated Data Fetching
  const fetchData = useCallback(async (searchCity) => {
    setLoading(true);
    setError("");
    try {
      // 1. Fetch Current Weather
      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&units=${unit}&appid=${API_KEY}`
      );
      setWeather(weatherRes.data);
      setCity(searchCity);

      // Update History (Avoid Duplicates)
      setHistory((prev) => {
        const newHistory = [searchCity, ...prev.filter((c) => c.toLowerCase() !== searchCity.toLowerCase())];
        return newHistory.slice(0, 5); // Keep only top 5 recent
      });

      // 2. Fetch Forecast
      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${searchCity}&units=${unit}&appid=${API_KEY}`
      );
      // Filter for daily data (approx 12:00 PM readings)
      const daily = forecastRes.data.list.filter((reading) => reading.dt_txt.includes("12:00:00"));
      setForecast(daily);

    } catch (err) {
      setError("City not found! Please try again.");
      setWeather(null);
    } finally {
      setLoading(false);
    }
  }, [unit]);

  // Initial Load
  useEffect(() => {
    fetchData(city);
    // eslint-disable-next-line
  }, [unit]); // Removed 'city' from dependency to avoid loop, manual trigger handles city change

  const toggleUnit = () => {
    setUnit((prev) => (prev === "metric" ? "imperial" : "metric"));
  };

  const addToFavorites = () => {
    if (weather && !favorites.includes(weather.name)) {
      setFavorites([...favorites, weather.name]);
    }
  };

  return (
    <div className="app-container">
      <div className="container py-4">
        
        {/* Main Glass Card */}
        <motion.div 
          className="glass-card shadow-lg p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          
          {/* Header & Search Section */}
          <div className="row justify-content-center mb-4">
            <div className="col-md-8 text-center">
              <h2 className="fw-bold text-white mb-3 text-shadow">🌦️ Weather Dashboard</h2>
              <SearchBox onSearch={fetchData} />
              
              {/* Error Message */}
              {error && (
                <div className="alert alert-danger mt-3 py-2 rounded-pill shadow-sm">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading ? (
             <div className="text-center py-5 text-white">
               <div className="spinner-border" role="status">
                 <span className="visually-hidden">Loading...</span>
               </div>
               <p className="mt-2">Fetching fresh data...</p>
             </div>
          ) : (
            <div className="row g-4">
              
              {/* LEFT COLUMN: Main Weather & Forecast */}
              {/* Desktop: 8 columns | Tablet/Mobile: 12 columns (Full Width) */}
              <div className="col-lg-8 order-1 order-lg-1">
                <AnimatePresence mode='wait'>
                  {weather && (
                    <motion.div
                      key="weather-content"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <WeatherInfo
                        weather={weather}
                        unit={unit}
                        onToggleUnit={toggleUnit}
                        onAddToFavorites={addToFavorites}
                      />
                      <Forecast forecast={forecast} unit={unit} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* RIGHT COLUMN: Sidebar (Favorites & History) */}
              {/* Desktop: 4 columns | Tablet/Mobile: 12 columns (Stacks below weather) */}
              <div className="col-lg-4 order-2 order-lg-2">
                <div className="sidebar-glass p-3 rounded-4">
                  <Favorites favorites={favorites} onSelect={fetchData} />
                  <hr className="text-white opacity-50 my-4" />
                  <SearchHistory history={history} onSelect={fetchData} />
                </div>
              </div>

            </div>
          )}
        </motion.div>
      </div>

      {/* Chat Widget Fixed at bottom right */}
          <ChatWidget weather={weather} city={city} />
    </div>
  );
}