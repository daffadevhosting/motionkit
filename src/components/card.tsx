import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'
import { useAnimation, type AnimationConfig } from '../hooks/useAnimation'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass'
  hover?: 'none' | 'lift' | 'glow'
  animateOn?: AnimationConfig
  staggerChildren?: boolean
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, animateOn, staggerChildren, variant = 'default', hover = 'none', ...props }, forwardedRef) => { // Renamed ref to forwardedRef
    const animRef = useAnimation<HTMLDivElement>(animateOn || { // Use new signature, pass forwardedRef
      type: 'fadeIn',
      trigger: 'onMount',
      duration: 800
    }, forwardedRef)

    const variantClasses = {
      default: 'bg-white border border-gray-200',
      elevated: 'bg-white shadow-sm',
      glass: 'bg-white/20 backdrop-blur-md border border-white/30',
    }[variant]

    const hoverClasses = {
      none: '',
      lift: 'hover:scale-105',
      glow: 'hover:shadow-lg',
    }[hover]

    // Destructure props to avoid conflict with motion props
    // Extracting custom props before spreading the rest
    const { onClick, ...restProps } = props;

    // Type assertion to any to avoid motion props conflicts
    const passThroughProps: any = { ...restProps };

    return (
      <motion.div
        ref={animRef} // Apply the animRef directly
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={hover === 'lift' ? { y: -5 } : {}}
        className={cn(
          'rounded-lg p-6 transition-all duration-300',
          variantClasses,
          hoverClasses,
          className
        )}
        {...passThroughProps}
      >
        {staggerChildren ? (
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1
                }
              }
            }}
            initial="hidden"
            animate="visible"
          >
            {children}
          </motion.div>
        ) : (
          children
        )}
      </motion.div>
    )
  }
)
Card.displayName = 'Card'

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

export const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('pt-4', className)}
    {...props}
  />
))
CardContent.displayName = 'CardContent'