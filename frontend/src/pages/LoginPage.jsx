import { ArrowRight, Building2, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../App'
import * as api from '../api'
import { Alert } from '../components/ui/alert'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'

const demoAccounts = [
  { email: 'alice@acme.com', role: 'admin' },
  { email: 'bob@acme.com', role: 'developer' },
  { email: 'frank@acme.com', role: 'product manager' },
]

export default function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await api.login(email)
      login(data.user)
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='grid min-h-screen bg-slate-950 lg:grid-cols-[1.1fr_0.9fr]'>
      <div className='relative hidden overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(250,204,21,0.28),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.35),_transparent_38%),linear-gradient(160deg,#133117_10%,#166534_55%,#365314_100%)] p-12 text-white lg:flex lg:flex-col'>
        <div className='absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-40' />
        <div className='relative z-10 flex items-center gap-3'>
          <div className='rounded-2xl bg-white/10 p-3 backdrop-blur'>
            <Building2 className='h-7 w-7' />
          </div>
          <div>
            <p className='text-lg font-semibold'>Acme Corp</p>
            <p className='text-sm text-white/70'>Operations intelligence dashboard</p>
          </div>
        </div>

        <div className='relative z-10 mt-auto max-w-lg space-y-6'>
          <Badge className='w-fit bg-white/10 text-white hover:bg-white/10'>Now using shadcn-style UI</Badge>
          <h1 className='text-5xl font-semibold leading-tight tracking-tight'>
            Run your internal ops from a calmer, more consistent workspace.
          </h1>
          <p className='text-lg text-white/70'>
            Review team health, manage users, and monitor API status from one polished control panel.
          </p>
          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur'>
              <p className='text-sm text-white/70'>Visibility</p>
              <p className='mt-2 text-3xl font-semibold'>360°</p>
              <p className='mt-2 text-sm text-white/60'>Users, teams, and service health at a glance.</p>
            </div>
            <div className='rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur'>
              <p className='text-sm text-white/70'>Response time</p>
              <p className='mt-2 text-3xl font-semibold'>&lt; 1 min</p>
              <p className='mt-2 text-sm text-white/60'>Take action on staffing and access changes quickly.</p>
            </div>
          </div>
        </div>
      </div>

      <div className='flex items-center justify-center bg-background px-6 py-12'>
        <Card className='w-full max-w-md border-border/80 shadow-xl shadow-slate-950/5'>
          <CardHeader className='space-y-4'>
            <div className='flex items-center gap-3 lg:hidden'>
              <div className='rounded-xl bg-primary/10 p-2 text-primary'>
                <ShieldCheck className='h-5 w-5' />
              </div>
              <div>
                <p className='font-semibold'>Acme Corp</p>
                <p className='text-sm text-muted-foreground'>Admin dashboard</p>
              </div>
            </div>
            <div>
              <CardTitle className='text-3xl'>Welcome back</CardTitle>
              <CardDescription>Sign in with an existing Acme account to continue.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className='space-y-6'>
            {error ? <Alert variant='destructive'>{error}</Alert> : null}

            <form className='space-y-5' onSubmit={handleSubmit}>
              <div className='space-y-2'>
                <Label htmlFor='email'>Email address</Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='alice@acme.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type='submit' className='w-full' disabled={loading}>
                {loading ? 'Signing in...' : 'Sign in'}
                <ArrowRight className='h-4 w-4' />
              </Button>
            </form>

            <div className='rounded-xl border bg-muted/50 p-4'>
              <p className='text-sm font-medium text-foreground'>Demo accounts</p>
              <div className='mt-3 space-y-2'>
                {demoAccounts.map((account) => (
                  <button
                    key={account.email}
                    type='button'
                    onClick={() => setEmail(account.email)}
                    className='flex w-full items-center justify-between rounded-lg border border-transparent bg-background px-3 py-2 text-left transition hover:border-border hover:bg-accent'
                  >
                    <div>
                      <p className='font-mono text-sm'>{account.email}</p>
                      <p className='text-xs text-muted-foreground'>{account.role}</p>
                    </div>
                    <Badge variant='secondary'>Use</Badge>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
