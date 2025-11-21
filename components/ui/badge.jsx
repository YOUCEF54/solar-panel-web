import { cn } from '@/lib/utils'

export function Badge({ className, variant = 'default', ...props }) {
  const base = 'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold'
  const variants = {
    default: 'border-transparent bg-blue-100 text-blue-800',
    success: 'border-transparent bg-green-100 text-green-800',
    warning: 'border-transparent bg-yellow-100 text-yellow-800',
    destructive: 'border-transparent bg-red-100 text-red-800',
    outline: 'border-gray-300 text-gray-800',
  }

  return (
    <span className={cn(base, variants[variant] || variants.default, className)} {...props} />
  )
}

