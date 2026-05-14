import { cn } from '../../lib/utils'

function Label({ className, ...props }) {
  /* biome-ignore lint/a11y/noLabelWithoutControl: shadcn-style label wrapper forwards htmlFor to call sites */
  return <label className={cn('text-sm font-medium leading-none', className)} {...props} />
}

export { Label }
