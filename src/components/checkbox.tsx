import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'
import { useAnimation, type AnimationConfig } from '../hooks/useAnimation'

// Fix: Change extends interface
interface CheckboxProps extends React.HTMLAttributes<HTMLButtonElement> {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  animateOn?: AnimationConfig
  label?: React.ReactNode; // Added label prop
}

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  (
    {
      checked,
      onCheckedChange,
      disabled = false,
      size = 'md',
      animateOn,
      className,
      label, // Destructure label
      ...props
    },
    forwardedRef // Renamed ref to forwardedRef for clarity
  ) => {
    const animRef = useAnimation<HTMLButtonElement>(animateOn || { // Use new signature, pass forwardedRef
      type: 'fadeIn',
      trigger: 'onMount',
      duration: 500
    }, forwardedRef)

    const sizeClasses = {
      sm: 'w-4 h-4 rounded text-xs',
      md: 'w-5 h-5 rounded-md text-sm',
      lg: 'w-6 h-6 rounded-lg text-base',
    }[size]

    const checkmarkSize = {
      sm: 'h-3 w-3',
      md: 'h-4 w-4',
      lg: 'h-5 w-5',
    }[size]

    const id = React.useId(); // Generate unique ID for accessibility if label is provided

    // Destructure original props to separate 'onClick' and create 'passThroughProps'
    const { onClick: propOnClick, ...rest } = props;
    const passThroughProps: any = { ...rest };

    return (
      <div className="flex items-center">
        <motion.button
          id={id} // Assign id for label association
          type="button"
          role="checkbox"
          aria-checked={checked}
          onClick={(e) => { // Use explicit event object
            if (!disabled) {
              onCheckedChange(!checked);
            }
            propOnClick?.(e); // Call original onClick
          }}
          disabled={disabled}
          ref={animRef} // Apply the animRef directly
          whileTap={{ scale: disabled ? 1 : 0.95 }}
          className={cn(
            'flex items-center justify-center transition-all duration-200',
            'border-2 focus:outline-none focus:ring-2 focus:ring-offset-2',
            checked
              ? 'bg-primary-500 border-primary-500 text-white'
              : 'bg-white border-gray-300 text-transparent',
            disabled && 'opacity-50 cursor-not-allowed',
            sizeClasses,
            className
          )}
          {...passThroughProps} // Spread the any-casted object
        >
          {checked && (
            <motion.svg
              className={cn('pointer-events-none', checkmarkSize)}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <motion.path d="M20 6L9 17L4 12" />
            </motion.svg>
          )}
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
)

Checkbox.displayName = 'Checkbox'