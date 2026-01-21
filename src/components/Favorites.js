import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MapPin } from "lucide-react";

export default function Favorites({ favorites, onSelect }) {
  
  // Empty State: Agar favorites nahi hain
  if (!favorites || favorites.length === 0) {
    return (
      <div className="mt-4 p-3 text-center border rounded-4 bg-light bg-opacity-50 border-dashed">
        <Star size={24} className="text-muted mb-2 opacity-50" />
        <p className="m-0 small text-muted">No favorite cities added yet.</p>
      </div>
    );
  }

  // Staggered Animation Logic
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <div className="mt-4 px-2">
      {/* Header */}
      <div className="d-flex align-items-center mb-3">
        <div className="bg-warning bg-opacity-25 p-2 rounded-circle me-2">
          <Star size={20} className="text-warning-emphasis" fill="currentColor" />
        </div>
        <h5 className="m-0 fw-bold text-dark">Your Favorites</h5>
      </div>

      {/* List of Favorites */}
      <motion.div 
        className="d-flex flex-wrap gap-2"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <AnimatePresence>
          {favorites.map((city, index) => (
            <motion.button
              key={`${city}-${index}`}
              variants={itemVariants}
              layout // Smooth layout shift agar koi item delete ho (future proofing)
              whileHover={{ 
                scale: 1.05, 
                backgroundColor: "#fff3cd", // Light yellow on hover
                borderColor: "#ffc107"
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(city)}
              className="btn bg-white border shadow-sm rounded-pill d-flex align-items-center px-3 py-2"
              style={{ transition: "all 0.2s" }}
            >
              {/* Location Icon */}
              <MapPin size={14} className="me-2 text-secondary" />
              
              <span className="fw-bold text-dark me-2">{city}</span>
              
              {/* Decorative Star */}
              <Star size={12} className="text-warning" fill="gold" />
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}