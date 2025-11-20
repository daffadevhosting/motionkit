import React, { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../lib/utils'
import { useAnimation, type AnimationConfig } from '../hooks/useAnimation'

interface SelectContextType {
  value: string
  onValueChange: (value: string) => void
  disabled: boolean
  setOpen: (open: boolean) => void
}

const SelectContext = React.createContext<SelectContextType | undefined>(undefined)

interface SelectProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  onValueChange: (value: string) => void
  disabled?: boolean
  animateOn?: AnimationConfig
  placeholder?: string
}

// Make Select a forwardRef component
export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({
    value: controlledValue,
    onValueChange,
    disabled = false,
    animateOn,
    placeholder,
    className,
    children,
    ...props
  }, forwardedRef) => { // Accept forwardedRef
    const [value, setValue] = useState(controlledValue || '')
    const [open, setOpen] = useState(false)
    const selectRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      if (controlledValue !== undefined && controlledValue !== value) {
        setValue(controlledValue);
      }
    }, [controlledValue, value]);

    const handleValueChange = useCallback((newValue: string) => {
      setValue(newValue)
      onValueChange(newValue)
      setOpen(false) // Close dropdown after selection
    }, [onValueChange])

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
          setOpen(false)
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
      <SelectContext.Provider
        value={{
          value,
          onValueChange: handleValueChange,
          disabled,
          setOpen,
        }}
      >
        <div className={cn('relative', className)} ref={forwardedRef} {...props}> {/* Pass forwardedRef directly */}
          {React.Children.map(children, child => {
            if (React.isValidElement(child) && child.type === SelectTrigger) {
              return React.cloneElement(child, {
                placeholder: placeholder,
                currentValue: value,
                isOpen: open,
                onClick: () => setOpen(!open),
                animateOn: animateOn, // Pass animateOn to trigger
                disabled: disabled // Pass disabled to trigger
              } as any)
            }
            if (React.isValidElement(child) && child.type === SelectContent) {
              return React.cloneElement(child, { isOpen: open, value: value } as any)
            }
            return child
          })}
        </div>
      </SelectContext.Provider>
    )
  }
)

Select.displayName = 'Select'

interface SelectTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  placeholder?: string
  currentValue?: string
  isOpen?: boolean
  animateOn?: AnimationConfig
  disabled?: boolean // Added disabled prop
}

export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  (
    { className, children, placeholder, currentValue, isOpen, animateOn, disabled, onClick: propOnClick, ...rest }, // Destructure onClick
    forwardedRef // Use forwardedRef
  ) => {
    const context = React.useContext(SelectContext)
    const isDisabled = disabled || context?.disabled

    const animRef = useAnimation<HTMLButtonElement>(animateOn || { // Use new signature, pass forwardedRef
      type: 'fadeIn',
      trigger: 'onMount',
      duration: 500
    }, forwardedRef) // Pass forwardedRef

    const passThroughProps: any = { ...rest }; // Create passThroughProps


    return (
      <motion.button
        ref={animRef} // Apply animRef directly
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        disabled={isDisabled}
        onClick={propOnClick} // Use propOnClick
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm',
          'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        whileTap={{ scale: isDisabled ? 1 : 0.98 }}
        {...passThroughProps} // Spread passThroughProps
      >
        <span>
          {currentValue ? (children || currentValue) : (placeholder || 'Select an option')}
        </span>
        <svg
          className={cn('h-4 w-4 opacity-50 transition-transform duration-200', isOpen && 'rotate-180')}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </motion.button>
    )
  }
)

SelectTrigger.displayName = 'SelectTrigger'

interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean
  value?: string
}

export const SelectContent = ({
  children,
  className,
  isOpen,
  ...props
}: SelectContentProps) => {
  const { onClick: propOnClick, ...rest } = props; // Destructure onClick
  const passThroughProps: any = { ...rest }; // Create passThroughProps

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className={cn(
            'absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg',
            className
          )}
          onClick={propOnClick} // Use propOnClick
          {...passThroughProps} // Spread passThroughProps
        >
          <motion.ul role="listbox" className="py-1">
            {React.Children.map(children, child => {
              if (React.isValidElement(child) && (child.type === SelectItem || child.type === SelectSeparator)) {
                return child
              }
              return null
            })}
          </motion.ul>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

SelectContent.displayName = 'SelectContent'

interface SelectItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  value: string
  disabled?: boolean
}

export const SelectItem = React.forwardRef<HTMLLIElement, SelectItemProps>(
  ({ className, children, value, disabled, onClick: propOnClick, ...rest }, ref) => { // Destructure onClick
    const context = React.useContext(SelectContext)

    if (!context) {
      throw new Error('SelectItem must be used within a Select')
    }

    const { value: selectedValue, onValueChange, disabled: groupDisabled, setOpen } = context
    const isSelected = selectedValue === value
    const isDisabled = disabled || groupDisabled

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLLIElement>) => {
        if (!isDisabled) {
          onValueChange(value)
          propOnClick?.(event) // Call original onClick
          setOpen(false)
        }
      },
      [isDisabled, onValueChange, value, propOnClick, setOpen] // Updated dependencies
    )

    const passThroughProps: any = { ...rest }; // Create passThroughProps

    return (
      <motion.li
        ref={ref}
        role="option"
        aria-selected={isSelected}
        data-state={isSelected ? 'selected' : 'unselected'}
        onClick={handleClick}
        className={cn(
          'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none',
          'focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
          isSelected && 'bg-primary-50 text-primary-700 font-medium',
          className
        )}
        whileTap={{ scale: isDisabled ? 1 : 0.98 }}
        {...passThroughProps} // Spread passThroughProps
      >
        {isSelected && (
          <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
            <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </span>
        )}
        {children}
      </motion.li>
    )
  }
)

SelectItem.displayName = 'SelectItem'

interface SelectSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

export const SelectSeparator = React.forwardRef<HTMLDivElement, SelectSeparatorProps>(
  ({ className, ...props }, ref) => {
    const { onClick: propOnClick, ...rest } = props; // Destructure onClick
    const passThroughProps: any = { ...rest }; // Create passThroughProps
    return (
      <div
        ref={ref}
        className={cn('-mx-1 my-1 h-px bg-gray-100', className)}
        onClick={propOnClick}
        {...passThroughProps}
      />
    )
  }
)

SelectSeparator.displayName = 'SelectSeparator'