import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'
import { useAnimation, type AnimationConfig } from '../hooks/useAnimation'

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  animateOn?: AnimationConfig
  indicatorClassName?: string
}

export const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      value,
      max = 100,
      animateOn,
      className,
      indicatorClassName,
      ...props
    },
    forwardedRef
  ) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100))

    const animRef = useAnimation<HTMLDivElement>(animateOn || { // Use new signature, pass forwardedRef
      type: 'fadeIn',
      trigger: 'onMount',
      duration: 500
    }, forwardedRef)

    const { onClick: propOnClick, ...rest } = props; // Destructure onClick
    const passThroughProps: any = { ...rest }; // Create passThroughProps

    return (
      <motion.div
        ref={animRef} // Apply the animRef directly
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className={cn(
          'relative h-2 w-full overflow-hidden rounded-full bg-gray-200',
          className
        )}
        onClick={propOnClick}
        {...passThroughProps} // Spread passThroughProps
      >
        <motion.div
          className={cn('h-full bg-primary-500 transition-colors', indicatorClassName)}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </motion.div>
    )
  }
)

ProgressBar.displayName = 'ProgressBar'
