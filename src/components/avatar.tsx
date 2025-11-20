import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../lib/utils'

import { useAnimation, type AnimationConfig } from '../hooks/useAnimation' // Import useAnimation and AnimationConfig

interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string
  alt?: string
  fallback?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  shape?: 'circle' | 'square'
  animateOn?: AnimationConfig // Change type to AnimationConfig
}

export const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt = 'Avatar', 
  fallback, 
  size = 'md', 
  shape = 'circle', 
  className,
  animateOn,
  ...props 
}) => {
  const animRef = useAnimation<HTMLDivElement>(animateOn || { // Use new signature, pass null for forwardedRef
    type: 'fadeIn',
    trigger: 'onMount',
    duration: 500
  }, null) // Pass null as there's no forwardedRef


  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg'
  }[size]

  const shapeClasses = shape === 'circle' 
    ? 'rounded-full' 
    : 'rounded-md'

  const imageClasses = cn(
    'object-cover',
    sizeClasses,
    shapeClasses,
    className
  )

  return (
    <motion.div
      ref={animRef} // Apply animRef
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={cn('relative overflow-hidden', sizeClasses, shapeClasses)}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className={imageClasses}
          {...props}
        />
      ) : (
        <div className={cn(
          'flex items-center justify-center bg-gray-200 text-gray-700',
          sizeClasses,
          shapeClasses,
          className
        )}>
          {fallback || alt.charAt(0).toUpperCase()}
        </div>
      )}
    </motion.div>
  )
}

interface AvatarGroupProps {
  children: React.ReactNode
  max?: number
  className?: string
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({ 
  children, 
  max = 4, 
  className 
}) => {
  const childrenArray = React.Children.toArray(children).slice(0, max)
  
  return (
    <div className={cn('flex -space-x-3', className)}>
      {childrenArray.map((child, index) => (
        <div key={index} className="border-2 border-white dark:border-gray-800">
          {child}
        </div>
      ))}
      {React.Children.count(children) > max && (
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-700 border-2 border-white dark:border-gray-800 text-xs">
          +{React.Children.count(children) - max}
        </div>
      )}
    </div>
  )
}