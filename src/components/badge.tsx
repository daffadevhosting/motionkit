import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'

import { useAnimation, type AnimationConfig } from '../hooks/useAnimation' // Import useAnimation and AnimationConfig

type BadgeVariant = 
  | 'default' 
  | 'primary' 
  | 'secondary' 
  | 'destructive' 
  | 'outline' 
  | 'ghost'

type BadgeSize = 'sm' | 'md' | 'lg'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: BadgeSize
  rounded?: 'sm' | 'md' | 'lg' | 'full'
  animateOn?: AnimationConfig // Change type to AnimationConfig
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default', 
  size = 'md', 
  rounded = 'full',
  className,
  animateOn,
  ...props 
}) => {
  const animRef = useAnimation<HTMLSpanElement>(animateOn || { // Use new signature, pass null for forwardedRef
    type: 'fadeIn',
    trigger: 'onMount',
    duration: 500
  }, null) // Pass null as there's no forwardedRef

  const variantClasses = {
    default: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
    primary: 'bg-primary-500 text-white hover:bg-primary-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    destructive: 'bg-destructive-500 text-white hover:bg-destructive-600',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
    ghost: 'text-gray-700 hover:bg-gray-100'
  }[variant]

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1'
  }[size]

  const roundedClasses = {
    sm: 'rounded',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
  }[rounded]

  const badgeClasses = cn(
    'inline-flex items-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
    variantClasses,
    sizeClasses,
    roundedClasses,
    className
  )

  // Destructure props to separate event handlers
  const { onClick, ...restProps } = props;

  // Type assertion to any to avoid motion props conflicts
  const passThroughProps: any = { ...restProps };

  return (
    <motion.span
      ref={animRef} // Apply animRef
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={badgeClasses}
      {...passThroughProps}
    >
      {children}
    </motion.span>
  )
}

interface BadgeGroupProps {
  children: React.ReactNode
  separator?: React.ReactNode
  className?: string
}

export const BadgeGroup: React.FC<BadgeGroupProps> = ({ 
  children, 
  separator = <span className="mx-1 text-gray-400">•</span>,
  className 
}) => {
  const childrenArray = React.Children.toArray(children)
  const childrenWithSeparators = []

  for (let i = 0; i < childrenArray.length; i++) {
    childrenWithSeparators.push(childrenArray[i])
    if (i < childrenArray.length - 1) {
      childrenWithSeparators.push(
        <span key={`separator-${i}`}>
          {separator}
        </span>
      )
    }
  }

  return (
    <div className={cn('flex items-center', className)}>
      {childrenWithSeparators}
    </div>
  )
}