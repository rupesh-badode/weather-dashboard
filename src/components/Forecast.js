import React from "react";
import { motion } from "framer-motion";
import { CalendarDays } from "lucide-react";

export default function Forecast({ forecast, unit }) {
  // Animation Variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15 // Har card 0.15s ke gap pe aayega
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Helper to format date (e.g., "Mon, 20")
  const formatDate = (dateString) => {
    const options = { weekday: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="mt-5">
      <div className="d-flex align-items-center mb-3 text-secondary">
        <CalendarDays size={20} className="me-2 text-white" />
        <h5 className="m-0 fw-bold text-white">5-Day Forecast</h5>
      </div>

      <motion.div 
        className="row g-3 justify-content-center" // 'g-3' adds gap between cols
        variants={container}
        initial="hidden"
        animate="show"
      >
        {forecast.map((day, index) => (
          <motion.div 
            key={index} 
            className="col-6 col-md-4 col-lg-2" // Mobile: 2 items/row, Desktop: 5 items/row
            variants={item}
          >
            <motion.div 
              className="card border-0 shadow-sm h-100 text-center"
              style={{ 
                background: "linear-gradient(to bottom, #ffffff, #f8f9fa)", 
                borderRadius: "15px" 
              }}
              whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }} // Hover lift effect
            >
              <div className="card-body p-3 d-flex flex-column align-items-center justify-content-center">
                
                {/* Date */}
                <p className="small text-muted mb-1 fw-bold text-uppercase">
                  {formatDate(day.dt_txt)}
                </p>

                {/* Weather Icon */}
                <img 
                  src={`http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`} 
                  alt={day.weather[0].description}
                  style={{ width: "60px", height: "60px" }}
                />

                {/* Temperature */}
                <h5 className="fw-bold mb-1">
                  {Math.round(day.main.temp)}°{unit === "metric" ? "C" : "F"}
                </h5>

                {/* Description */}
                <small className="text-secondary text-capitalize" style={{ fontSize: "0.8rem" }}>
                  {day.weather[0].main}
                </small>

              </div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}