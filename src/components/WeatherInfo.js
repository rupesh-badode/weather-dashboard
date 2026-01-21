import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wind, Droplets, Eye, Thermometer, MapPin, Star, Gauge } from 'lucide-react'; // Modern icons

export default function WeatherInfo({ weather, unit, onToggleUnit, onAddToFavorites }) {
  
  useEffect(() => {
    console.log("Weather data:", weather);
  }, [weather]);

  // Guard clause with a nice loading skeleton
  if (!weather || !weather.main || !weather.sys) {
    return (
      <div className="d-flex justify-content-center align-items-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Weather Icon URL from OpenWeatherMap
  const iconUrl = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`;

  // Dynamic Background based on Temp (Blue for cold, Orange for warm)
  const isWarm = unit === "metric" ? weather.main.temp > 25 : weather.main.temp > 77;
  const bgGradient = isWarm 
    ? "linear-gradient(135deg, #6b66ff 0%, #220650 100%)" // Warm
    : "linear-gradient(135deg, #003e24 0%, #00060e 100%)"; // Cold

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <motion.div 
      className="card mb-4 shadow-lg border-0 text-white"
      style={{ background: bgGradient, borderRadius: '20px', overflow: 'hidden' }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="card-body p-4">
        {/* Header Section */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <motion.h4 variants={itemVariants} className="d-flex align-items-center gap-2 m-0">
            <MapPin size={24} /> {weather.name}, {weather.sys.country}
          </motion.h4>
          <span className="badge bg-dark bg-opacity-25 p-2 rounded-pill">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </span>
        </div>

        {/* Main Weather Info (Center) */}
        <div className="text-center my-4">
          <motion.img 
            src={iconUrl} 
            alt={weather.weather[0].description} 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1.1 }}
            transition={{ yoyo: Infinity, duration: 2 }} // Subtle breathing animation
            style={{ width: '120px', height: '120px', filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.2))' }}
          />
          <motion.h1 className="display-3 fw-bold" variants={itemVariants}>
            {Math.round(weather.main.temp)}°{unit === "metric" ? "C" : "F"}
          </motion.h1>
          <p className="lead text-capitalize opacity-75">
            {weather.weather[0].description} • Feels like {Math.round(weather.main.feels_like)}°
          </p>
        </div>

        {/* Details Grid (Responsive) */}
        <div className="row g-3 bg-white bg-opacity-25 p-3 rounded-4 mx-1 backdrop-blur">
          <WeatherDetail icon={<Droplets />} label="Humidity" value={`${weather.main.humidity}%`} />
          <WeatherDetail icon={<Wind />} label="Wind" value={`${weather.wind.speed} m/s`} />
          <WeatherDetail icon={<Eye />} label="Visibility" value={`${(weather.visibility / 1000).toFixed(1)} km`} />
          <WeatherDetail icon={<Gauge />} label="Pressure" value={`${weather.main.pressure} hPa`} />
        </div>

        {/* Action Buttons */}
        <div className="d-flex justify-content-center gap-3 mt-4">
          <ActionButton onClick={onToggleUnit} color="light">
            <Thermometer size={18} /> °{unit === "metric" ? "F" : "C"}
          </ActionButton>
          
          <ActionButton onClick={onAddToFavorites} color="warning">
            <Star size={18} /> Save
          </ActionButton>
        </div>
      </div>
    </motion.div>
  );
}

// Helper Component for Details to keep code clean
function WeatherDetail({ icon, label, value }) {
  return (
    <div className="col-6 col-md-3 text-center">
      <div className="d-flex flex-column align-items-center">
        <div className="mb-1 opacity-75">{icon}</div>
        <small className="opacity-75">{label}</small>
        <span className="fw-bold fs-5">{value}</span>
      </div>
    </div>
  );
}

// Helper Component for Buttons with Hover Animation
function ActionButton({ onClick, children, color }) {
  return (
    <motion.button 
      className={`btn btn-${color} d-flex align-items-center gap-2 rounded-pill px-4 fw-bold shadow-sm`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  );
}