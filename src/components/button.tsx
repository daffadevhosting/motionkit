import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'
import { useAnimation, type AnimationConfig } from '../hooks/useAnimation'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  animation?: 'none' | 'pulse' | 'bounce'
  animateOn?: AnimationConfig
  ripple?: boolean
  loading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className,
    children,
    animateOn,
    ripple = true,
    loading = false,
    variant = 'default',
    size = 'md',
    ...props
  }, forwardedRef) => { // Renamed ref to forwardedRef
    const animRef = useAnimation<HTMLButtonElement>(animateOn || { // Use new signature, pass forwardedRef
      type: 'fadeIn',
      trigger: 'onMount',
      duration: 500
    }, forwardedRef)

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (ripple && !loading) {
        const button = e.currentTarget
        const circle = document.createElement('span')
        const diameter = Math.max(button.clientWidth, button.clientHeight)
        const radius = diameter / 2

        circle.style.width = circle.style.height = `${diameter}px`
        circle.style.left = `${e.clientX - button.offsetLeft - radius}px`
        circle.style.top = `${e.clientY - button.offsetTop - radius}px`
        circle.classList.add('ripple')

        const rippleElement = button.getElementsByClassName('ripple')[0]
        if (rippleElement) {
          rippleElement.remove()
        }

        button.appendChild(circle)
      }

      props.onClick?.(e)
    }

    // Map variant and size to classes
    const variantClasses = {
      default: 'bg-primary-500 text-white hover:bg-primary-600',
      destructive: 'bg-destructive-500 text-white hover:bg-destructive-600',
      outline: 'border border-gray-300 bg-transparent hover:bg-gray-50',
      ghost: 'bg-transparent hover:bg-gray-100',
    }[variant]

    const sizeClasses = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    }[size]

    // Destructure props to separate event handlers
    // Using type assertion to handle the conflict between React and Framer Motion event handlers
    const {
      onClick,
      ...restProps
    } = props;

    // Type assertion to any to avoid motion props conflicts
    const passThroughProps: any = { ...restProps };

    return (
      <motion.button
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        ref={animRef} // Apply the animRef directly
        {...passThroughProps}
        onClick={handleClick}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none relative overflow-hidden',
          variantClasses,
          sizeClasses,
          loading && 'cursor-not-allowed',
          className
        )}
        disabled={loading}
      >
        {loading && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
          />
        )}
        {children}

      </motion.button>
    )
  }
)

Button.displayName = 'Button'