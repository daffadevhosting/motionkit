import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'

interface ToggleProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
  label?: React.ReactNode // Add label prop
  activeColor?: string // Add activeColor prop
  inactiveColor?: string // Add inactiveColor prop
  disabled?: boolean // Ensure disabled prop is available
}

export const Toggle: React.FC<ToggleProps> = ({
  enabled,
  onChange,
  size = 'md',
  className,
  label,
  activeColor = 'bg-primary-500', // Default active color
  inactiveColor = 'bg-gray-200', // Default inactive color
  disabled = false, // Default disabled to false
  ...props
}) => {
  const sizes = {
    sm: 'w-8 h-4',
    md: 'w-12 h-6',
    lg: 'w-16 h-8'
  }

  const knobSizes = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-7 h-7'
  }

  // Generate a unique ID for accessibility if label is provided
  const id = React.useId();

  return (
    <div className="flex items-center">
      <motion.button
        id={id} // Assign id for label association
        type="button"
        role="switch" // Add ARIA role
        aria-checked={enabled} // Add ARIA checked state
        disabled={disabled} // Apply disabled prop
        className={cn(
          'relative inline-flex items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500',
          enabled ? activeColor : inactiveColor, // Use customizable colors
          sizes[size],
          disabled && 'opacity-50 cursor-not-allowed', // Disabled styling
          className
        )}
        onClick={() => !disabled && onChange(!enabled)} // Prevent click if disabled
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        {...props}
      >
        <motion.span
          className={cn(
            'inline-block transform bg-white rounded-full transition-transform',
            knobSizes[size]
          )}
          animate={{
            x: enabled 
              ? size === 'sm' ? 16 : size === 'md' ? 24 : 32 
              : 2
          }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </motion.button>
      {label && (
        <label
          htmlFor={id} // Associate label with button via id
          className={cn(
            'ml-2 text-sm text-gray-700 cursor-pointer',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {label}
        </label>
      )}
    </div>
  )
}