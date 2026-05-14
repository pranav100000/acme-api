import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as api from '../api'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'

function getRoleVariant(role) {
  return {
    admin: 'warning',
    developer: 'success',
    designer: 'secondary',
    product_manager: 'lime',
  }[role] || 'secondary'
}

function getStatusVariant(status) {
  return {
    active: 'success',
    inactive: 'destructive',
    pending: 'warning',
  }[status] || 'secondary'
}

function StatCard({ title, value, detail, icon: Icon, accentClass = 'bg-primary/10 text-primary' }) {
  return (
    <Card className='border-border/70'>
      <CardHeader className='flex flex-row items-start justify-between space-y-0 pb-3'>
        <div>
          <CardDescription>{title}</CardDescription>
          <CardTitle className='mt-2 text-3xl'>{value}</CardTitle>
        </div>
        <div className={`rounded-xl p-2 ${accentClass}`}>
          <Icon className='h-5 w-5' />
        </div>
      </CardHeader>
      <CardContent>
        <p className='text-sm text-muted-foreground'>{detail}</p>
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  const [users, setUsers] = useState([])
  const [teams, setTeams] = useState([])
  const [health, setHealth] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersData, teamsData, healthData] = await Promise.all([
          api.getUsers(),
          api.getTeams(),
          api.healthCheck(),
        ])
        setUsers(usersData)
        setTeams(teamsData)
        setHealth(healthData)
      } catch (err) {
        console.error('Failed to load dashboard data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return <div className='flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground'>Loading dashboard…</div>
  }

  const activeUsers = users.filter((u) => u.status === 'active').length
  const pendingUsers = users.filter((u) => u.status === 'pending').length
  const recentUsers = [...users]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)

  return (
    <div className='space-y-8 p-4 md:p-8'>
      <section className='rounded-3xl border border-border/60 bg-[linear-gradient(135deg,rgba(34,197,94,0.14),rgba(250,204,21,0.12),rgba(255,255,255,0.92))] p-6 shadow-sm md:p-8'>
        <div className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
          <div className='space-y-3'>
            <Badge variant='secondary' className='w-fit'>
              <Sparkles className='mr-1 h-3.5 w-3.5' />
              Executive overview
            </Badge>
            <div>
              <h2 className='text-3xl font-semibold tracking-tight md:text-4xl'>Dashboard</h2>
              <p className='mt-2 max-w-2xl text-sm text-muted-foreground md:text-base'>
                Keep an eye on team coverage, recent activity, and platform health from one place.
              </p>
            </div>
          </div>
          <div className='flex flex-wrap gap-3'>
            <div className='rounded-2xl border bg-background/80 px-4 py-3 shadow-sm'>
              <div className='flex items-center gap-2 text-sm font-medium'>
                <ShieldCheck className={`h-4 w-4 ${health?.status === 'ok' ? 'text-green-600' : 'text-red-500'}`} />
                API {health?.status === 'ok' ? 'Healthy' : 'Unhealthy'}
              </div>
              <p className='mt-1 text-xs text-muted-foreground'>Live system health check from /health.</p>
            </div>
            <Button asChild>
              <Link to='/users'>Review users</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className='grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
        <StatCard title='Total users' value={users.length} detail={`${activeUsers} active • ${pendingUsers} pending`} icon={Users} />
        <StatCard title='Teams' value={teams.length} detail={`${teams.reduce((sum, t) => sum + t.members.length, 0)} total memberships`} icon={ArrowUpRight} accentClass='bg-yellow-100 text-yellow-800' />
        <StatCard title='Unique roles' value={new Set(users.map((u) => u.role)).size} detail='Coverage across the org chart' icon={Sparkles} accentClass='bg-lime-100 text-lime-800' />
        <StatCard title='API status' value={health?.status === 'ok' ? '✓' : '✕'} detail={health?.status === 'ok' ? 'All systems operational' : 'Issues detected'} icon={Activity} accentClass={health?.status === 'ok' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} />
      </section>

      <section className='grid gap-6 xl:grid-cols-2'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <div>
              <CardTitle>Recent users</CardTitle>
              <CardDescription>Newest additions to the workspace.</CardDescription>
            </div>
            <Button variant='outline' size='sm' asChild>
              <Link to='/users'>View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className='font-medium'>{user.name}</div>
                      <div className='text-sm text-muted-foreground'>{user.email}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleVariant(user.role)}>{user.role.replace('_', ' ')}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(user.status)}>{user.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <div>
              <CardTitle>Teams overview</CardTitle>
              <CardDescription>Membership and creation dates by team.</CardDescription>
            </div>
            <Button variant='outline' size='sm' asChild>
              <Link to='/teams'>View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teams.map((team) => (
                  <TableRow key={team.id}>
                    <TableCell className='font-medium'>{team.name}</TableCell>
                    <TableCell>{team.members.length} members</TableCell>
                    <TableCell className='text-muted-foreground'>{new Date(team.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className='border-dashed'>
          <CardContent className='flex items-center gap-3 p-6 text-sm text-muted-foreground'>
            <CheckCircle2 className='h-4 w-4 text-green-600' />
            This screen now uses composable, shadcn-style cards, badges, buttons, and tables instead of the old bespoke CSS widgets.
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
