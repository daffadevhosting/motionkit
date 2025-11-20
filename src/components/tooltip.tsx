import React, { useState, useCallback, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../lib/utils'
import { useAnimation, type AnimationConfig } from '../hooks/useAnimation'

interface TooltipContextType {
  open: boolean
  setOpen: (open: boolean) => void
  delayDuration: number
  triggerRef: React.RefObject<HTMLElement>
  contentId: string
  startShowTimer: () => void;
  startHideTimer: () => void;
  clearAllTimers: () => void;
  animateOn?: AnimationConfig;
}

const TooltipContext = React.createContext<TooltipContextType | undefined>(undefined)

interface TooltipProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  delayDuration?: number
  animateOn?: AnimationConfig
  children: React.ReactNode
}

export const Tooltip = ({
  open: controlledOpen,
  onOpenChange,
  delayDuration = 700,
  animateOn,
  children,
}: TooltipProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const open = controlledOpen ?? uncontrolledOpen
  const triggerRef = useRef<HTMLElement>(null)
  const contentId = React.useId()
  let showTimeoutRef = useRef<number | null>(null)
  let hideTimeoutRef = useRef<number | null>(null)

  const handleOpenChange = useCallback((newOpen: boolean) => {
    if (controlledOpen === undefined) {
      setUncontrolledOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  }, [controlledOpen, onOpenChange])

  const startShowTimer = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
    if (showTimeoutRef.current) return
    showTimeoutRef.current = window.setTimeout(() => {
      handleOpenChange(true)
      showTimeoutRef.current = null
    }, delayDuration)
  }, [delayDuration, handleOpenChange])

  const startHideTimer = useCallback(() => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current)
      showTimeoutRef.current = null
    }
    if (hideTimeoutRef.current) return
    hideTimeoutRef.current = window.setTimeout(() => {
      handleOpenChange(false)
      hideTimeoutRef.current = null
    }, delayDuration)
  }, [delayDuration, handleOpenChange])

  const clearAllTimers = useCallback(() => {
    if (showTimeoutRef.current) {
      clearTimeout(showTimeoutRef.current)
      showTimeoutRef.current = null
    }
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
  }, [])

  useEffect(() => clearAllTimers, [clearAllTimers])


  const contextValue: TooltipContextType = React.useMemo(() => ({
    open,
    setOpen: handleOpenChange,
    delayDuration,
    triggerRef,
    contentId,
    startShowTimer,
    startHideTimer,
    clearAllTimers,
    animateOn,
  }), [open, handleOpenChange, delayDuration, contentId, startShowTimer, startHideTimer, clearAllTimers, animateOn])

  return (
    <TooltipContext.Provider value={contextValue}>
      {children}
    </TooltipContext.Provider>
  )
}

Tooltip.displayName = 'Tooltip'

interface TooltipTriggerProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactElement
}

export const TooltipTrigger = React.forwardRef<HTMLElement, TooltipTriggerProps>(
  ({ children, onClick: propOnClick, ...rest }, forwardedRef) => { // Destructure onClick
    const context = React.useContext(TooltipContext)
    if (!context) {
      throw new Error('TooltipTrigger must be used within a Tooltip')
    }

    const { open, setOpen, triggerRef, contentId, startShowTimer, startHideTimer } = context

    // Use mergeRefs from useAnimation, or define a local one if not available globally
    const mergeRefs = useCallback((...refs: (React.MutableRefObject<HTMLElement> | React.Ref<HTMLElement> | null)[]) => {
      return (node: HTMLElement) => {
        refs.forEach(ref => {
          if (!ref) return;
          if (typeof ref === 'function') {
            ref(node);
          } else {
            (ref as React.MutableRefObject<HTMLElement>).current = node;
          }
        });
      };
    }, []);

    const composedRefs = mergeRefs(forwardedRef, triggerRef);

    const child = React.Children.only(children)
    const passThroughProps: any = { ...rest }; // Create passThroughProps


    return React.cloneElement(child, {
      ...passThroughProps, // Spread passThroughProps
      ref: composedRefs,
      'aria-describedby': open ? contentId : undefined,
      onMouseEnter: (event: React.MouseEvent<HTMLElement>) => {
        startShowTimer()
        child.props.onMouseEnter?.(event)
      },
      onMouseLeave: (event: React.MouseEvent<HTMLElement>) => {
        startHideTimer()
        child.props.onMouseLeave?.(event)
      },
      onFocus: (event: React.FocusEvent<HTMLElement>) => {
        startShowTimer()
        child.props.onFocus?.(event)
      },
      onBlur: (event: React.FocusEvent<HTMLElement>) => {
        startHideTimer()
        child.props.onBlur?.(event)
      },
      onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
        if (event.key === 'Escape') {
          setOpen(false)
        }
        child.props.onKeyDown?.(event)
      },
      onClick: (event: React.MouseEvent<HTMLElement>) => { // Pass original onClick
        propOnClick?.(event);
        child.props.onClick?.(event);
      }
    })
  }
)

TooltipTrigger.displayName = 'TooltipTrigger'

interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'top' | 'bottom' | 'left' | 'right'
  align?: 'start' | 'center' | 'end'
  offset?: number
}

export const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ className, children, side = 'top', align = 'center', offset = 8, onClick: propOnClick, ...rest }, forwardedRef) => { // Use forwardedRef
    const context = React.useContext(TooltipContext)
    if (!context) {
      throw new Error('TooltipContent must be used within a Tooltip')
    }

    const { open, contentId, triggerRef, startShowTimer, startHideTimer, animateOn } = context
    const contentRef = useRef<HTMLDivElement>(null)

    const [position, setPosition] = useState({ top: 0, left: 0 })

    useEffect(() => {
      if (open && triggerRef.current && contentRef.current) {
        const triggerRect = triggerRef.current.getBoundingClientRect()
        const contentRect = contentRef.current.getBoundingClientRect()

        let newTop = 0
        let newLeft = 0

        switch (side) {
          case 'top':
            newTop = triggerRect.top - contentRect.height - offset
            break
          case 'bottom':
            newTop = triggerRect.bottom + offset
            break
          case 'left':
            newLeft = triggerRect.left - contentRect.width - offset
            break
          case 'right':
            newLeft = triggerRect.right + offset
            break
        }

        switch (align) {
          case 'center':
            if (side === 'top' || side === 'bottom') {
              newLeft = triggerRect.left + (triggerRect.width - contentRect.width) / 2
            } else {
              newTop = triggerRect.top + (triggerRect.height - contentRect.height) / 2
            }
            break
          case 'start':
            if (side === 'top' || side === 'bottom') {
              newLeft = triggerRect.left
            } else {
              newTop = triggerRect.top
            }
            break
          case 'end':
            if (side === 'top' || side === 'bottom') {
              newLeft = triggerRect.right - contentRect.width
            } else {
              newTop = triggerRect.bottom - contentRect.height
            }
            break
        }

        setPosition({ top: newTop, left: newLeft })
      }
    }, [open, side, align, offset, triggerRef])

    const animRef = useAnimation<HTMLDivElement>(animateOn || { // Use context.animateOn
      type: 'fadeIn',
      trigger: 'onMount',
      duration: 300
    }, forwardedRef) // Pass forwardedRef

    const passThroughProps: any = { ...rest }; // Create passThroughProps

    return (
      <AnimatePresence>
        {open && (
          <motion.div
            ref={animRef} // Apply animRef directly
            id={contentId}
            role="tooltip"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            style={{ top: position.top, left: position.left, position: 'fixed' }}
            className={cn(
              'z-50 overflow-hidden rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm shadow-md',
              className
            )}
            onMouseEnter={startShowTimer}
            onMouseLeave={startHideTimer}
            onFocus={startShowTimer}
            onBlur={startHideTimer}
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

TooltipContent.displayName = 'TooltipContent'