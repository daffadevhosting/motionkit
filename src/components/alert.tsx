import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../lib/utils'

// SVG Icons for Alerts
const InfoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.446a1.125 1.125 0 0 0-2.25 0V12h.75a.75.75 0 0 1 0 1.5h-.75v2.25a.75.75 0 0 1 1.5 0v-2.107l.707.707a.75.75 0 0 1-1.06 1.06l-.894-.894a.75.75 0 0 1-.22-.53V12h-.75a.75.75 0 0 1-.75-.75V10.5Z" clipRule="evenodd" />
  </svg>
)

const SuccessIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.532l-1.492-1.492a.75.75 0 1 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
  </svg>
)

const WarningIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M9.401 3.003c1.155-2.003 4.043-2.003 5.198 0l.643 1.115c.139.24.21.507.21.78V16.5a.75.75 0 0 1-1.5 0V4.897L12 3.518L9.401 3.003Zm-.507 8.272a.75.75 0 0 0-.825.105c-.624.593-1.045 1.44-.982 2.193.076.953.58 1.94 1.34 2.656.76.716 1.706 1.103 2.677 1.103h.711a.75.75 0 0 1 0 1.5h-.711c-1.218 0-2.339-.429-3.235-1.266C7.545 16.3 7.087 15.228 7.027 14.28c-.067-.822.361-1.637.954-2.227a.75.75 0 0 0 .106-.82Z" clipRule="evenodd" />
  </svg>
)

const DestructiveIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
  </svg>
)

const DefaultIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.446a1.125 1.125 0 0 0-2.25 0V12h.75a.75.75 0 0 1 0 1.5h-.75v2.25a.75.75 0 0 1 1.5 0v-2.107l.707.707a.75.75 0 0 1-1.06 1.06l-.894-.894a.75.75 0 0 1-.22-.53V12h-.75a.75.75 0 0 1-.75-.75V10.5Z" clipRule="evenodd" />
  </svg>
)


type AlertVariant =
  | 'default'
  | 'info'
  | 'success'
  | 'warning'
  | 'destructive'

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
  show?: boolean
  closable?: boolean
  onClose?: () => void
  icon?: React.ReactNode // User can still override with custom icon
  title?: string
  description?: string
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'default',
  show = true,
  closable = false,
  onClose,
  icon,
  title,
  description,
  className,
  children,
  ...props
}) => {
  const variantClasses = {
    default: 'bg-white border border-gray-200 text-gray-700',
    info: 'bg-blue-50 border border-blue-200 text-blue-700',
    success: 'bg-green-50 border border-green-200 text-green-700',
    warning: 'bg-yellow-50 border border-yellow-200 text-yellow-700',
    destructive: 'bg-red-50 border border-red-200 text-red-700'
  }[variant]

  const iconClasses = {
    default: 'text-gray-500',
    info: 'text-blue-500',
    success: 'text-green-500',
    warning: 'text-yellow-500',
    destructive: 'text-red-500'
  }[variant]

  // Determine default icon based on variant
  const defaultIcon = {
    default: <DefaultIcon className="h-5 w-5" />,
    info: <InfoIcon className="h-5 w-5" />,
    success: <SuccessIcon className="h-5 w-5" />,
    warning: <WarningIcon className="h-5 w-5" />,
    destructive: <DestructiveIcon className="h-5 w-5" />,
  }[variant]

  if (!show) return null

  // Refine passThroughProps by carefully destructuring to avoid 'any'
  const { onClick: propOnClick, ...rest } = props; // Use 'rest' instead of 'restProps'
  const passThroughProps: any = { ...rest }; // Create passThroughProps as any

  // Determine ARIA live region role
  const ariaLive = (variant === 'destructive') ? 'assertive' : 'polite';


  return (
    <AnimatePresence>
      <motion.div
        role="alert"
        aria-live={ariaLive}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className={cn(
          'relative p-4 rounded-lg flex items-start',
          variantClasses,
          className
        )}
        onClick={propOnClick} // Apply original onClick
        {...passThroughProps} // Spread the any-casted object
      >
        {(icon || defaultIcon) && ( // Render custom icon or default icon
          <span className={cn('mr-3 mt-0.5', iconClasses)}>
            {icon || defaultIcon}
          </span>
        )}
        <div className="flex-1">
          {title && (
            <h3 className="font-semibold">
              {title}
            </h3>
          )}
          {description && (
            <p className="mt-1 text-sm">
              {description}
            </p>
          )}
        </div>
        {closable && (
          <button
            onClick={onClose}
            className={cn(
              'ml-4 p-1 rounded-full hover:opacity-80 transition-opacity',
              variant === 'default' ? 'text-gray-500 hover:bg-gray-200' :
              variant === 'info' ? 'text-blue-500 hover:bg-blue-200' :
              variant === 'success' ? 'text-green-500 hover:bg-green-200' :
              variant === 'warning' ? 'text-yellow-500 hover:bg-yellow-200' :
              'text-red-500 hover:bg-red-200'
            )}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

interface AlertGroupProps {
  children: React.ReactNode
  className?: string
}

export const AlertGroup: React.FC<AlertGroupProps> = ({ children, className }) => {
  return (
    <div className={cn('space-y-3', className)}>
      {children}
    </div>
  )
}