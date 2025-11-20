import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'
import { useAnimation, type AnimationConfig } from '../hooks/useAnimation'

interface RadioGroupContextType {
  value: string | undefined
  onValueChange: (value: string) => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const RadioGroupContext = React.createContext<RadioGroupContextType | undefined>(
  undefined
)

interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  onValueChange: (value: string) => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  animateOn?: AnimationConfig
  orientation?: 'horizontal' | 'vertical'
}

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      value,
      onValueChange,
      disabled = false,
      size = 'md',
      animateOn,
      orientation = 'vertical',
      className,
      children,
      onClick: propOnClick, // Destructure onClick
      ...rest // Use rest for remaining props
    },
    forwardedRef
  ) => {
    const animRef = useAnimation<HTMLDivElement>(animateOn || { // Use new signature, pass forwardedRef
      type: 'fadeIn',
      trigger: 'onMount',
      duration: 500
    }, forwardedRef)

    const passThroughProps: any = { ...rest }; // Create passThroughProps

    return (
      <RadioGroupContext.Provider value={{ value, onValueChange, disabled, size }}>
        <motion.div
          role="radiogroup"
          aria-orientation={orientation}
          className={cn(
            'flex',
            orientation === 'vertical' ? 'flex-col space-y-2' : 'space-x-2',
            className
          )}
          ref={animRef} // Apply animRef directly
          onClick={propOnClick}
          {...passThroughProps} // Spread passThroughProps
        >
          {children}
        </motion.div>
      </RadioGroupContext.Provider>
    )
  }
)

RadioGroup.displayName = 'RadioGroup'

// Fix: Change extends interface
interface RadioGroupItemProps extends React.HTMLAttributes<HTMLButtonElement> {
  value: string
  id?: string
  disabled?: boolean // Added disabled prop
}

export const RadioGroupItem = React.forwardRef<HTMLButtonElement, RadioGroupItemProps>(
  (
    {
      value,
      id,
      className,
      children,
      onClick: propOnClick, // Destructure onClick
      ...rest // Use rest for remaining props
    },
    ref
  ) => {
    const context = React.useContext(RadioGroupContext)

    if (!context) {
      throw new Error('RadioGroupItem must be used within a RadioGroup')
    }

    const { value: groupValue, onValueChange, disabled: groupDisabled, size: groupSize } = context
    const checked = groupValue === value
    const disabled = groupDisabled || rest.disabled // Use rest.disabled

    const sizeClasses = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
    }[groupSize || 'md']

    const indicatorSizeClasses = {
      sm: 'w-2 h-2',
      md: 'w-3 h-3',
      lg: 'w-4 h-4',
    }[groupSize || 'md']

    const passThroughProps: any = { ...rest }; // Create passThroughProps

    return (
      <div className="flex items-center">
        <motion.button
          type="button"
          id={id || value}
          role="radio"
          aria-checked={checked}
          disabled={disabled}
          onClick={(e) => { // Use explicit event object
            if (!disabled) {
              onValueChange(value);
            }
            propOnClick?.(e); // Call original onClick
          }}
          ref={ref}
          whileTap={{ scale: disabled ? 1 : 0.95 }}
          className={cn(
            'flex items-center justify-center rounded-full border-2 transition-all duration-200',
            checked
              ? 'border-primary-500 bg-primary-500'
              : 'border-gray-300 bg-white',
            disabled && 'opacity-50 cursor-not-allowed',
            sizeClasses,
            className
          )}
          {...passThroughProps} // Spread passThroughProps
        >
          {checked && (
            <motion.span
              className={cn('block rounded-full bg-white', indicatorSizeClasses)}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 700, damping: 30 }}
            />
          )}
        </motion.button>
        {children && (
          <label
            htmlFor={id || value}
            className={cn(
              'ml-2 text-sm font-medium text-gray-700',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {children}
          </label>
        )}
      </div>
    )
  }
)

RadioGroupItem.displayName = 'RadioGroupItem'