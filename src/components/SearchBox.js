import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react"; // Icons

export default function SearchBox({ onSearch }) {
  const [input, setInput] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input);
      setInput(""); // Optional: Search ke baad clear karna hai ya nahi
    }
  };

  const handleClear = () => {
    setInput("");
    // Focus wapas input pe le aana user experience ke liye acha hai
    document.getElementById("weather-search-input")?.focus();
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
      // Dynamic Shadow & Border based on Focus state
      className={`d-flex align-items-center bg-white rounded-pill p-1 ps-3 transition-all ${
        isFocused ? "shadow-lg border-primary border-opacity-50" : "shadow-sm border"
      }`}
      style={{ border: isFocused ? "2px solid #60a5fa" : "1px solid #dee2e6" }}
    >
      {/* Search Icon (Decorative) */}
      <Search size={20} className={`me-2 ${isFocused ? "text-primary" : "text-secondary"}`} />

      {/* Input Field */}
      <input
        id="weather-search-input"
        type="text"
        className="form-control border-0 shadow-none bg-transparent"
        placeholder="Search city (e.g., Delhi, London)..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{ fontSize: "1.1rem" }}
      />

      {/* Clear 'X' Button (Only shows when input is not empty) */}
      <AnimatePresence>
        {input && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="btn btn-sm btn-light rounded-circle p-1 me-2 text-secondary"
            onClick={handleClear}
          >
            <X size={16} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Submit Button */}
      <motion.button 
        type="submit"
        className="btn btn-primary rounded-pill px-4 fw-bold"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Search
      </motion.button>
    </motion.form>
  );
}