import React from "react";
import { motion } from "framer-motion";

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "from-wine to-gold",
}) => {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-2xl shadow-sm border border-border p-6 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-center justify-between">

        <div>

          <p className="text-ink-muted text-sm font-medium">
            {title}
          </p>

          <h2 className="text-3xl font-bold text-ink mt-2">
            {value}
          </h2>

          {subtitle && (
            <p className="text-green-600 text-sm mt-2">
              {subtitle}
            </p>
          )}

        </div>

        <div
          className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${color} flex items-center justify-center shadow-lg`}
        >
          {Icon && <Icon size={30} className="text-white" />}
        </div>

      </div>
    </motion.div>
  );
};

export default StatCard;