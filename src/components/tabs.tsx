import React, { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../lib/utils'
import { useAnimation, type AnimationConfig } from '../hooks/useAnimation'

interface TabsContextType {
  value: string
  onValueChange: (value: string) => void
  orientation: 'horizontal' | 'vertical'
}

const TabsContext = React.createContext<TabsContextType | undefined>(undefined)

interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  orientation?: 'horizontal' | 'vertical'
  animateOn?: AnimationConfig
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>( // Add forwardRef
  ({
    defaultValue,
    value: controlledValue,
    onValueChange,
    orientation = 'horizontal',
    animateOn,
    className,
    children,
    onClick: propOnClick, // Destructure onClick
    ...rest // Use rest for remaining props
  }, forwardedRef) => { // Accept forwardedRef
    const [internalValue, setInternalValue] = useState(defaultValue || '')
    const value = controlledValue !== undefined ? controlledValue : internalValue

    const handleValueChange = useCallback((newValue: string) => {
      if (controlledValue === undefined) {
        setInternalValue(newValue)
      }
      onValueChange?.(newValue)
    }, [controlledValue, onValueChange])

    const animRef = useAnimation<HTMLDivElement>(animateOn || { // Use new signature, pass forwardedRef
      type: 'fadeIn',
      trigger: 'onMount',
      duration: 500
    }, forwardedRef) // Pass forwardedRef

    const passThroughProps: any = { ...rest }; // Create passThroughProps

    return (
      <TabsContext.Provider value={{ value, onValueChange: handleValueChange, orientation }}>
        <motion.div
          ref={animRef} // Apply animRef directly
          className={cn('flex', orientation === 'vertical' ? 'flex-row' : 'flex-col', className)}
          onClick={propOnClick}
          {...passThroughProps} // Spread passThroughProps
        >
          {children}
        </motion.div>
      </TabsContext.Provider>
    )
  }
)

Tabs.displayName = 'Tabs'

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {}

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  ({ className, children, onClick: propOnClick, ...rest }, ref) => { // Destructure onClick
    const context = React.useContext(TabsContext)
    if (!context) {
      throw new Error('TabsList must be used within Tabs')
    }

    const { orientation, value } = context
    const [activeRect, setActiveRect] = useState<DOMRect | null>(null)
    const listRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      if (listRef.current) {
        const activeTab = listRef.current.querySelector(`[data-state="active"]`)
        if (activeTab) {
          setActiveRect(activeTab.getBoundingClientRect())
        }
      }
    }, [value, children]) // Re-calculate when active tab changes or children update

    const passThroughProps: any = { ...rest }; // Create passThroughProps

    return (
      <motion.div
        ref={ref}
        role="tablist"
        aria-orientation={orientation}
        className={cn(
          'relative inline-flex items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500',
          orientation === 'vertical' ? 'flex-col h-fit' : 'h-10',
          className
        )}
        onClick={propOnClick}
        {...passThroughProps} // Spread passThroughProps
      >
        {children}
        {activeRect && (
          <motion.div
            layoutId="active-tab-indicator"
            className="absolute rounded-sm bg-white shadow-sm"
            initial={false}
            animate={{
              x: activeRect.left - (listRef.current?.getBoundingClientRect().left || 0),
              y: activeRect.top - (listRef.current?.getBoundingClientRect().top || 0),
              width: activeRect.width,
              height: activeRect.height,
            }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
          />
        )}
      </motion.div>
    )
  }
)

TabsList.displayName = 'TabsList'

interface TabsTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  value: string
  disabled?: boolean
}

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, children, value, disabled, onClick: propOnClick, ...rest }, ref) => { // Destructure onClick
    const context = React.useContext(TabsContext)
    if (!context) {
      throw new Error('TabsTrigger must be used within TabsList (which is within Tabs)')
    }

    const { value: activeValue, onValueChange } = context
    const isActive = activeValue === value

    const passThroughProps: any = { ...rest }; // Create passThroughProps

    return (
      <motion.button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={isActive}
        aria-controls={`tabpanel-${value}`}
        id={`tab-${value}`}
        disabled={disabled}
        onClick={(e) => { // Explicitly handle onClick
          if (!disabled) {
            onValueChange(value);
          }
          propOnClick?.(e); // Call original onClick
        }}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1 text-sm font-medium',
          'ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700',
          className
        )}
        data-state={isActive ? 'active' : 'inactive'}
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        {...passThroughProps} // Spread passThroughProps
      >
        {children}
      </motion.button>
    )
  }
)

TabsTrigger.displayName = 'TabsTrigger'

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, children, value, onClick: propOnClick, ...rest }, ref) => { // Destructure onClick
    const context = React.useContext(TabsContext)
    if (!context) {
      throw new Error('TabsContent must be used within Tabs')
    }

    const { value: activeValue } = context
    const isActive = activeValue === value

    const passThroughProps: any = { ...rest }; // Create passThroughProps

    return (
      <AnimatePresence mode="wait">
        {isActive && (
          <motion.div
            key={value} // Important for AnimatePresence to work correctly
            ref={ref}
            role="tabpanel"
            id={`tabpanel-${value}`}
            aria-labelledby={`tab-${value}`}
            className={cn('mt-2', className)}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            onClick={propOnClick}
            {...passThroughProps} // Spread passThroughProps
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    )
  }
)

TabsContent.displayName = 'TabsContent'