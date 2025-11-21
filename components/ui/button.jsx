import * as React from 'react'
import { cn } from '@/lib/utils'

const baseStyles =
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'

const variants = {
  default: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600',
  outline:
    'border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 focus-visible:ring-gray-400',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-900',
}

const sizes = {
  default: 'h-9 px-4 py-2',
  sm: 'h-8 px-3 text-xs',
  lg: 'h-10 px-6 text-base',
}

const Button = React.forwardRef(function Button(
  { className, variant = 'default', size = 'default', ...props },
  ref,
) {
  const variantClasses = variants[variant] || variants.default
  const sizeClasses = sizes[size] || sizes.default

  return (
    <button
      ref={ref}
      className={cn(baseStyles, variantClasses, sizeClasses, className)}
      {...props}
    />
  )
})

export { Button }

