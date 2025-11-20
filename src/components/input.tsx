import React from 'react'
import { cn } from '../lib/utils'

import { useAnimation, type AnimationConfig } from '../hooks/useAnimation' // Import useAnimation and AnimationConfig

type InputVariant = 'default' | 'error' | 'success';
type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps
  extends React.HTMLAttributes<HTMLInputElement> {
  variant?: InputVariant;
  size?: InputSize;
  animateOn?: AnimationConfig;
  type?: string; // Explicitly added type prop
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      variant = 'default',
      size = 'md',
      animateOn,
      ...props
    },
    forwardedRef
  ) => {
    const animRef = useAnimation<HTMLInputElement>(animateOn || { // Use new signature, pass forwardedRef
      type: 'fadeIn',
      trigger: 'onMount',
      duration: 500
    }, forwardedRef)

    const variantClasses = {
      default: 'border-gray-300 focus:ring-primary-500',
      error: 'border-red-500 focus:ring-red-500',
      success: 'border-green-500 focus:ring-green-500',
    }[variant];

    const sizeClasses = {
      sm: 'h-8 px-2 py-1 text-sm',
      md: 'h-10 px-3 py-2 text-base',
      lg: 'h-12 px-4 py-2.5 text-lg',
    }[size];

    return (
      <input
        type={type}
        className={cn(
          'flex w-full rounded-md bg-transparent placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          variantClasses,
          sizeClasses,
          className
        )}
        ref={animRef} // Apply the animRef directly
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }