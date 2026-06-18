import { CountUp } from '../animations/CountUp'
import { motion } from 'framer-motion';

export function StatCard({ title, value, subtext, icon, gradient = 'stat-gradient-violet', index = 0 }) {
  // Parse numeric value for count-up
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  const suffix = typeof value === 'string' ? value.replace(/[\d.]/g, '') : '';
  const isNumeric = !isNaN(numericValue);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={`relative overflow-hidden rounded-2xl p-6 ${gradient} text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-default`}
    >
      {/* Shimmer overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 shimmer-effect"></div>
      </div>

      {/* Decorative circle */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full"></div>
      <div className="absolute -bottom-4 -right-2 w-16 h-16 bg-white/5 rounded-full"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-white/80 text-sm font-medium">{title}</span>
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-lg backdrop-blur-sm">
            {icon}
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-display font-bold">
            {isNumeric ? <CountUp target={numericValue} suffix={suffix} /> : value}
          </span>
          {subtext && (
            <span className="text-sm font-medium text-white/70 flex items-center gap-1">
              <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
                <path d="M6 2L10 7H2L6 2Z" fill="currentColor"/>
              </svg>
              {subtext}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
