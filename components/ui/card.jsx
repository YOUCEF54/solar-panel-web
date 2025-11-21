import * as React from 'react'
import { cn } from '@/lib/utils'

function Card({ className, ...props }) {
  return (
    <div
      className={cn('rounded-lg border border-gray-200 bg-white shadow-sm', className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }) {
  return <div className={cn('border-b border-gray-100 p-4', className)} {...props} />
}

function CardTitle({ className, ...props }) {
  return (
    <h3
      className={cn('text-lg font-semibold leading-none tracking-tight text-gray-900', className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }) {
  return <div className={cn('p-4 pt-2', className)} {...props} />
}

export { Card, CardHeader, CardTitle, CardContent }

