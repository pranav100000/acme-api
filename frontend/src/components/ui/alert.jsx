import { cn } from '../../lib/utils'

function Alert({ className, variant = 'default', ...props }) {
  return (
    <div
      role='alert'
      className={cn(
        'relative w-full rounded-lg border px-4 py-3 text-sm',
        variant === 'destructive'
          ? 'border-red-200 bg-red-50 text-red-800'
          : 'border-emerald-200 bg-emerald-50 text-emerald-800',
        className,
      )}
      {...props}
    />
  )
}

export { Alert }
