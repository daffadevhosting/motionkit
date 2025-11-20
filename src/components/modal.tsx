import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../lib/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  overlayClassName?: string
  contentClassName?: string
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  overlayClassName,
  contentClassName
}) => {
  const contentRef = useRef<HTMLDivElement>(null)

  // Escape Key Close & Focus Management
  useEffect(() => {
    if (isOpen) {
      // Focus modal content when it opens
      contentRef.current?.focus()

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose()
        }
      }
      document.addEventListener('keydown', handleKeyDown)
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [isOpen, onClose])

  // Scroll Lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = '' // Cleanup on unmount
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            'fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4',
            overlayClassName
          )}
          onClick={onClose}
        >
          <motion.div
            ref={contentRef} // Apply ref to modal content for focus management
            tabIndex={-1} // Make div focusable
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              'bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-auto focus:outline-none', // Added focus:outline-none
              contentClassName
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}