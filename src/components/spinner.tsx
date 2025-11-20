import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: string
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'currentColor',
  className,
  onClick: propOnClick, // Destructure onClick
  ...rest // Use rest for remaining props
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-3',
    lg: 'h-8 w-8 border-3',
    xl: 'h-10 w-10 border-4',
  }[size]

  const passThroughProps: any = { ...rest }; // Create passThroughProps

  return (
    <motion.div
      role="status"
      aria-label="Loading..."
      className={cn('inline-block animate-spin rounded-full border-t-transparent', sizeClasses, className)}
      style={{ borderColor: color, borderTopColor: 'transparent' }}
      transition={{ duration: 0.8, ease: 'linear', repeat: Infinity }}
      onClick={propOnClick}
      {...passThroughProps} // Spread passThroughProps
    >
      <span className="sr-only">Loading...</span>
    </motion.div>
  )
}

Spinner.displayName = 'Spinner'
