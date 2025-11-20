import { useEffect, useRef, useCallback, MutableRefObject } from 'react'
import anime from 'animejs'

export type AnimationType = 
  | 'fadeIn' 
  | 'slideUp' 
  | 'slideDown' 
  | 'scale' 
  | 'bounce' 
  | 'shake'
  | 'pulse'
  | 'tada'

export interface AnimationConfig {
  type: AnimationType
  duration?: number
  delay?: number
  easing?: string
  loop?: boolean
  trigger?: 'onMount' | 'onHover' | 'onClick' | 'onView'
}

// Function to safely merge refs
function mergeRefs<T = any>(...refs: (React.MutableRefObject<T> | React.Ref<T> | null)[]) {
  return (node: T) => {
    refs.forEach(ref => {
      if (!ref) return;
      if (typeof ref === 'function') {
        ref(node);
      } else {
        (ref as React.MutableRefObject<T>).current = node;
      }
    });
  };
}


export const useAnimation = <T extends HTMLElement>(config: AnimationConfig, forwardedRef?: React.Ref<T>) => {
  const internalRef = useRef<T>(null) as MutableRefObject<T | null>; // Explicitly type as MutableRefObject<T | null>

  // Combined ref to expose to the component
  const combinedRef = useCallback(
    (node: T) => {
      internalRef.current = node;
      if (forwardedRef) {
        mergeRefs(forwardedRef)(node);
      }
    },
    [forwardedRef]
  );

  useEffect(() => {
    if (!internalRef.current) return

    const element = internalRef.current

    const getAnimationProps = () => {
      const baseProps = {
        targets: element,
        duration: config.duration || 1000,
        delay: config.delay || 0,
        easing: config.easing || 'easeOutElastic(1, .5)',
        loop: config.loop || false,
      }

      switch (config.type) {
        case 'fadeIn':
          return {
            ...baseProps,
            opacity: [0, 1],
            translateY: [20, 0],
          }
        case 'slideUp':
          return {
            ...baseProps,
            opacity: [0, 1],
            translateY: [50, 0],
          }
        case 'slideDown':
          return {
            ...baseProps,
            opacity: [0, 1],
            translateY: [-50, 0],
          }
        case 'scale':
          return {
            ...baseProps,
            scale: [0, 1],
            opacity: [0, 1],
          }
        case 'bounce':
          return {
            ...baseProps,
            translateY: [0, -30, 0],
            opacity: [0, 1],
          }
        case 'shake':
          return {
            ...baseProps,
            translateX: [0, -10, 10, -10, 10, 0],
            opacity: [0, 1],
          }
        case 'pulse':
          return {
            ...baseProps,
            scale: [1, 1.05, 1],
            opacity: [0, 1],
          }
        case 'tada':
          return {
            ...baseProps,
            rotate: [0, -5, 5, -5, 5, 0],
            scale: [1, 1.1, 1],
            opacity: [0, 1],
          }
        default:
          return baseProps
      }
    }

    const playAnimation = () => {
      anime(getAnimationProps())
    }

    if (config.trigger === 'onMount') {
      playAnimation()
    } else if (config.trigger === 'onHover') {
      element.addEventListener('mouseenter', playAnimation)
      return () => element.removeEventListener('mouseenter', playAnimation)
    } else if (config.trigger === 'onClick') {
      element.addEventListener('click', playAnimation)
      return () => element.removeEventListener('click', playAnimation)
    } else if (config.trigger === 'onView') {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            playAnimation()
            observer.unobserve(element)
          }
        },
        { threshold: 0.1 }
      )
      observer.observe(element)
      return () => observer.unobserve(element)
    }
  }, [config])

  return combinedRef
}