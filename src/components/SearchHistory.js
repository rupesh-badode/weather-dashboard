import React from "react";
import { motion } from "framer-motion";
import { History, Search } from "lucide-react";

export default function SearchHistory({ history, onSelect }) {
  // Agar history khali hai, to kuch mat dikhao (ya message dikhao)
  if (history.length === 0) {
    return (
      <div className="text-center mt-4 opacity-50">
        <small>No recent searches</small>
      </div>
    );
  }

  // Animations configuration
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1 // Har item 0.1s ke gap pe aayega
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10, scale: 0.8 },
    show: { opacity: 1, y: 0, scale: 1 }
  };

  return (
    <div className="mt-4 px-2">
      <div className="d-flex align-items-center mb-3 text-secondary">
        <History size={20} className="me-2" />
        <h5 className="m-0 fw-bold">Recent Searches</h5>
      </div>

      <motion.div 
        className="d-flex flex-wrap gap-2"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {history.map((city, index) => (
          <motion.button
            key={`${city}-${index}`}
            variants={itemVariants}
            whileHover={{ scale: 1.05, backgroundColor: "#e9ecef" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(city)}
            className="btn btn-light border shadow-sm rounded-pill d-flex align-items-center px-3 py-2"
            style={{ transition: "background-color 0.2s" }}
          >
            <Search size={14} className="me-2 text-primary opacity-75" />
            <span className="fw-medium text-dark">{city}</span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}