import { Plus, UserCog, UserMinus } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import * as api from '../api'
import Modal from '../components/Modal'
import { Alert } from '../components/ui/alert'
import { Avatar, AvatarFallback } from '../components/ui/avatar'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Select } from '../components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table'

const filters = ['all', 'active', 'inactive', 'pending']
const roleOptions = [
  { value: 'developer', label: 'Developer' },
  { value: 'designer', label: 'Designer' },
  { value: 'admin', label: 'Admin' },
  { value: 'product_manager', label: 'Product Manager' },
]
const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
]

function getRoleVariant(role) {
  return {
    admin: 'violet',
    developer: 'info',
    designer: 'rose',
    product_manager: 'orange',
  }[role] || 'secondary'
}

function getStatusVariant(status) {
  return {
    active: 'success',
    inactive: 'destructive',
    pending: 'warning',
  }[status] || 'secondary'
}

function UserForm({ form, setForm, onSubmit, onClose, loading, submitLabel, error, showStatus = false }) {
  return (
    <>
      {error ? <Alert variant='destructive'>{error}</Alert> : null}
      <form className='space-y-4' onSubmit={onSubmit}>
        <div className='space-y-2'>
          <Label htmlFor='user-name'>Name</Label>
          <Input id='user-name' value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder='John Doe' />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='user-email'>Email</Label>
          <Input id='user-email' type='email' value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required placeholder='john@acme.com' />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='user-role'>Role</Label>
          <Select id='user-role' value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </Select>
        </div>
        {showStatus ? (
          <div className='space-y-2'>
            <Label htmlFor='user-status'>Status</Label>
            <Select id='user-status' value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </Select>
          </div>
        ) : null}
        <div className='flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end'>
          <Button type='button' variant='outline' onClick={onClose}>Cancel</Button>
          <Button type='submit' disabled={loading}>{loading ? `${submitLabel}...` : submitLabel}</Button>
        </div>
      </form>
    </>
  )
}

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [filter, setFilter] = useState('all')

  const loadUsers = useCallback(async () => {
    try {
      const data = await api.getUsers()
      setUsers(data)
    } catch {
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const handleDelete = async (user) => {
    if (!window.confirm(`Deactivate ${user.name}? This will set their status to inactive.`)) return
    try {
      await api.deleteUser(user.id)
      setSuccess(`${user.name} has been deactivated`)
      loadUsers()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message)
      setTimeout(() => setError(''), 3000)
    }
  }

  const filteredUsers = useMemo(
    () => (filter === 'all' ? users : users.filter((user) => user.status === filter)),
    [filter, users],
  )

  if (loading) {
    return <div className='flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground'>Loading users…</div>
  }

  return (
    <div className='space-y-6 p-4 md:p-8'>
      <div className='flex flex-col gap-4 rounded-3xl border bg-background p-6 shadow-sm md:flex-row md:items-center md:justify-between'>
        <div>
          <h2 className='text-3xl font-semibold tracking-tight'>Users</h2>
          <p className='mt-2 text-sm text-muted-foreground'>Manage people, roles, and activation state across the workspace.</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className='h-4 w-4' />
          Add user
        </Button>
      </div>

      {error ? <Alert variant='destructive'>{error}</Alert> : null}
      {success ? <Alert>{success}</Alert> : null}

      <Card>
        <CardHeader className='gap-4 md:flex-row md:items-center md:justify-between'>
          <div>
            <CardTitle>Directory</CardTitle>
            <CardDescription>Filter by lifecycle state and update user records in place.</CardDescription>
          </div>
          <div className='flex flex-wrap gap-2'>
            {filters.map((currentFilter) => (
              <Button
                key={currentFilter}
                type='button'
                size='sm'
                variant={filter === currentFilter ? 'default' : 'outline'}
                onClick={() => setFilter(currentFilter)}
              >
                {currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1)}
                {currentFilter !== 'all' ? ` (${users.filter((user) => user.status === currentFilter).length})` : ''}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <div className='flex flex-col items-center justify-center gap-2 py-12 text-center text-muted-foreground'>
                      <UserCog className='h-8 w-8' />
                      <p>No users found for this filter.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => {
                  const initials = user.name.split(' ').map((part) => part[0]).join('')
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className='flex items-center gap-3'>
                          <Avatar>
                            <AvatarFallback>{initials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className='font-medium'>{user.name}</div>
                            <div className='text-sm text-muted-foreground'>{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRoleVariant(user.role)}>{user.role.replace('_', ' ')}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(user.status)}>{user.status}</Badge>
                      </TableCell>
                      <TableCell className='text-muted-foreground'>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className='flex justify-end gap-2'>
                          <Button type='button' variant='outline' size='sm' onClick={() => setEditingUser(user)}>Edit</Button>
                          {user.status !== 'inactive' ? (
                            <Button type='button' variant='destructive' size='sm' onClick={() => handleDelete(user)}>
                              <UserMinus className='h-4 w-4' />
                              Deactivate
                            </Button>
                          ) : null}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {showCreateModal ? (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false)
            loadUsers()
            setSuccess('User created successfully')
            setTimeout(() => setSuccess(''), 3000)
          }}
        />
      ) : null}

      {editingUser ? (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onUpdated={() => {
            setEditingUser(null)
            loadUsers()
            setSuccess('User updated successfully')
            setTimeout(() => setSuccess(''), 3000)
          }}
        />
      ) : null}
    </div>
  )
}

function CreateUserModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ name: '', email: '', role: 'developer' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.createUser(form)
      onCreated()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title='Create user' onClose={onClose}>
      <UserForm form={form} setForm={setForm} onSubmit={handleSubmit} onClose={onClose} loading={loading} submitLabel='Create user' error={error} />
    </Modal>
  )
}

function EditUserModal({ user, onClose, onUpdated }) {
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.updateUser(user.id, form)
      onUpdated()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title={`Edit ${user.name}`} onClose={onClose}>
      <UserForm
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
        onClose={onClose}
        loading={loading}
        submitLabel='Save changes'
        error={error}
        showStatus
      />
    </Modal>
  )
}
