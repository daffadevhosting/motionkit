import React from 'react'
import { cn, type VariantProps } from './utils'

interface BaseComponentProps {
  children?: React.ReactNode
  className?: string
  as?: React.ElementType
}

export function createComponent<
  T extends BaseComponentProps,
  V extends Record<string, Record<string, string>>
>(
  displayName: string,
  baseClasses: string,
  variants: V,
  defaultVariants?: Partial<VariantProps<V>>
) {
  type ComponentProps = T & { [K in keyof V]?: keyof V[K] } & { as?: React.ElementType };

  const Component = React.forwardRef<any, ComponentProps>(
    (props, ref) => {
      const { as, className, ...restProps } = props as any;

      // Extract variant classes
      const variantClasses: string[] = [];
      for (const variantName in variants) {
        if (variants.hasOwnProperty(variantName)) {
          const variantValue = (restProps as any)[variantName] as string | undefined;
          // Use the provided value or fall back to default
          const finalValue = variantValue || (defaultVariants && (defaultVariants as any)[variantName]);
          if (finalValue && variants[variantName][finalValue]) {
            variantClasses.push(variants[variantName][finalValue]);
          }
        }
      }

      const classes = cn(baseClasses, ...variantClasses, className);

      // Remove variant props from the element attributes to avoid passing them to DOM
      const elementProps: any = { ...restProps };
      for (const variantName in variants) {
        delete elementProps[variantName];
      }

      return React.createElement(as || 'div', {
        ...elementProps,
        ref,
        className: classes
      })
    }
  );

  Component.displayName = displayName;
  return Component;
}