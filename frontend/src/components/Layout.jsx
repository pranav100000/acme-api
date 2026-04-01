import {
  BarChart3,
  Building2,
  LogOut,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../App'
import { Avatar, AvatarFallback } from './ui/avatar'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { cn } from '../lib/utils'

const navigation = [
  { to: '/', label: 'Dashboard', icon: BarChart3 },
  { to: '/users', label: 'Users', icon: Users },
  { to: '/teams', label: 'Teams', icon: Building2 },
]

export default function Layout({ children }) {
  const { user, logout } = useAuth()
  const initials =
    user?.name
      ?.split(' ')
      .map((part) => part[0])
      .join('') || '?'

  return (
    <div className='min-h-screen bg-muted/40 text-foreground'>
      <div className='grid min-h-screen lg:grid-cols-[280px_1fr]'>
        <aside className='hidden border-r bg-sidebar text-sidebar-foreground lg:flex lg:flex-col'>
          <div className='flex items-start gap-3 px-6 py-6'>
            <div className='rounded-xl bg-primary/15 p-2 text-primary'>
              <Building2 className='h-6 w-6' />
            </div>
            <div className='space-y-1'>
              <div className='flex items-center gap-2'>
                <h1 className='text-lg font-semibold'>Acme Corp</h1>
                <Badge variant='secondary' className='bg-sidebar-accent text-sidebar-accent-foreground'>
                  Admin
                </Badge>
              </div>
              <p className='text-sm text-sidebar-foreground/70'>
                Internal operations command center
              </p>
            </div>
          </div>

          <div className='px-6 pb-4'>
            <div className='rounded-xl border border-white/10 bg-white/5 p-4'>
              <div className='flex items-center gap-2 text-sm font-medium'>
                <Sparkles className='h-4 w-4 text-yellow-300' />
                Shadcn refresh
              </div>
              <p className='mt-2 text-sm text-sidebar-foreground/70'>
                Cleaner primitives, better hierarchy, and a more consistent dashboard shell.
              </p>
            </div>
          </div>

          <nav className='flex-1 space-y-1 px-4'>
            {navigation.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-sm'
                      : 'text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  )
                }
              >
                <Icon className='h-4 w-4' />
                {label}
              </NavLink>
            ))}
          </nav>

          <div className='px-4 pb-4'>
            <Separator className='bg-white/10' />
            <div className='mt-4 flex items-center gap-3 rounded-xl bg-white/5 p-3'>
              <Avatar>
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className='min-w-0 flex-1'>
                <p className='truncate text-sm font-medium'>{user?.name}</p>
                <p className='truncate text-xs text-sidebar-foreground/70'>{user?.email}</p>
              </div>
              <Button variant='ghost' size='icon' className='text-sidebar-foreground/70 hover:bg-white/10 hover:text-white' onClick={logout}>
                <LogOut className='h-4 w-4' />
                <span className='sr-only'>Logout</span>
              </Button>
            </div>
          </div>
        </aside>

        <div className='flex min-h-screen flex-col'>
          <header className='sticky top-0 z-30 border-b bg-background/95 backdrop-blur lg:hidden'>
            <div className='flex items-center justify-between px-4 py-3'>
              <div className='flex items-center gap-3'>
                <div className='rounded-lg bg-primary/10 p-2 text-primary'>
                  <ShieldCheck className='h-5 w-5' />
                </div>
                <div>
                  <p className='text-sm font-semibold'>Acme Corp</p>
                  <p className='text-xs text-muted-foreground'>Admin dashboard</p>
                </div>
              </div>
              <Button variant='outline' size='sm' onClick={logout}>
                <LogOut className='h-4 w-4' />
                Logout
              </Button>
            </div>
          </header>
          <main className='flex-1'>{children}</main>
        </div>
      </div>
    </div>
  )
}
