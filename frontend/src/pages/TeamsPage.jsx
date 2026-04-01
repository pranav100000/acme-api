import { Plus, UserPlus2, Users } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
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

function getRoleVariant(role) {
  return {
    admin: 'violet',
    developer: 'info',
    designer: 'rose',
    product_manager: 'orange',
  }[role] || 'secondary'
}

export default function TeamsPage() {
  const [teams, setTeams] = useState([])
  const [users, setUsers] = useState([])
  const [teamMembers, setTeamMembers] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [addMemberTeam, setAddMemberTeam] = useState(null)

  const loadData = useCallback(async () => {
    try {
      const [teamsData, usersData] = await Promise.all([api.getTeams(), api.getUsers()])
      setTeams(teamsData)
      setUsers(usersData)

      const membersMap = {}
      await Promise.all(
        teamsData.map(async (team) => {
          try {
            const members = await api.getTeamMembers(team.id)
            membersMap[team.id] = members
          } catch {
            membersMap[team.id] = []
          }
        }),
      )
      setTeamMembers(membersMap)
    } catch {
      setError('Failed to load teams')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleRemoveMember = async (teamId, userId, userName) => {
    if (!window.confirm(`Remove ${userName} from this team?`)) return
    try {
      await api.removeTeamMember(teamId, userId)
      setSuccess(`${userName} removed from team`)
      loadData()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message)
      setTimeout(() => setError(''), 3000)
    }
  }

  if (loading) {
    return <div className='flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground'>Loading teams…</div>
  }

  return (
    <div className='space-y-6 p-4 md:p-8'>
      <div className='flex flex-col gap-4 rounded-3xl border bg-background p-6 shadow-sm md:flex-row md:items-center md:justify-between'>
        <div>
          <h2 className='text-3xl font-semibold tracking-tight'>Teams</h2>
          <p className='mt-2 text-sm text-muted-foreground'>Coordinate coverage across teams, create new groups, and manage membership.</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className='h-4 w-4' />
          Create team
        </Button>
      </div>

      {error ? <Alert variant='destructive'>{error}</Alert> : null}
      {success ? <Alert>{success}</Alert> : null}

      {teams.length === 0 ? (
        <Card>
          <CardContent className='flex flex-col items-center gap-3 py-16 text-center text-muted-foreground'>
            <Users className='h-10 w-10' />
            <p>No teams yet. Create your first team to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className='grid gap-6 xl:grid-cols-2'>
          {teams.map((team) => {
            const members = teamMembers[team.id] || []
            return (
              <Card key={team.id} className='overflow-hidden'>
                <CardHeader className='border-b bg-muted/30'>
                  <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
                    <div>
                      <CardTitle>{team.name}</CardTitle>
                      <CardDescription>
                        Created {new Date(team.createdAt).toLocaleDateString()} • Updated {new Date(team.updatedAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge variant='secondary'>{members.length} member{members.length !== 1 ? 's' : ''}</Badge>
                  </div>
                </CardHeader>
                <CardContent className='space-y-4 p-6'>
                  {members.length === 0 ? (
                    <div className='rounded-xl border border-dashed p-6 text-center text-sm text-muted-foreground'>No members yet</div>
                  ) : (
                    <div className='space-y-3'>
                      {members.map((member) =>
                        member ? (
                          <div key={member.id} className='flex items-center justify-between rounded-xl border bg-muted/30 px-4 py-3'>
                            <div className='flex items-center gap-3'>
                              <Avatar>
                                <AvatarFallback>{member.name.split(' ').map((part) => part[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className='font-medium'>{member.name}</div>
                                <div className='mt-1 flex flex-wrap items-center gap-2'>
                                  <Badge variant={getRoleVariant(member.role)}>{member.role.replace('_', ' ')}</Badge>
                                  <span className='text-sm text-muted-foreground'>{member.email}</span>
                                </div>
                              </div>
                            </div>
                            <Button type='button' variant='ghost' size='sm' onClick={() => handleRemoveMember(team.id, member.id, member.name)}>
                              Remove
                            </Button>
                          </div>
                        ) : null,
                      )}
                    </div>
                  )}

                  <Button type='button' variant='outline' className='w-full' onClick={() => setAddMemberTeam(team)}>
                    <UserPlus2 className='h-4 w-4' />
                    Add member
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {showCreateModal ? (
        <CreateTeamModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => {
            setShowCreateModal(false)
            loadData()
            setSuccess('Team created successfully')
            setTimeout(() => setSuccess(''), 3000)
          }}
        />
      ) : null}

      {addMemberTeam ? (
        <AddMemberModal
          team={addMemberTeam}
          users={users}
          currentMembers={teamMembers[addMemberTeam.id] || []}
          onClose={() => setAddMemberTeam(null)}
          onAdded={() => {
            setAddMemberTeam(null)
            loadData()
            setSuccess('Member added successfully')
            setTimeout(() => setSuccess(''), 3000)
          }}
        />
      ) : null}
    </div>
  )
}

function CreateTeamModal({ onClose, onCreated }) {
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.createTeam({ name })
      onCreated()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title='Create team' onClose={onClose}>
      {error ? <Alert variant='destructive'>{error}</Alert> : null}
      <form className='space-y-4' onSubmit={handleSubmit}>
        <div className='space-y-2'>
          <Label htmlFor='team-name'>Team name</Label>
          <Input id='team-name' value={name} onChange={(e) => setName(e.target.value)} required placeholder='e.g. Marketing' />
        </div>
        <div className='flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end'>
          <Button type='button' variant='outline' onClick={onClose}>Cancel</Button>
          <Button type='submit' disabled={loading}>{loading ? 'Creating...' : 'Create team'}</Button>
        </div>
      </form>
    </Modal>
  )
}

function AddMemberModal({ team, users, currentMembers, onClose, onAdded }) {
  const [selectedUserId, setSelectedUserId] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const currentMemberIds = currentMembers.filter(Boolean).map((member) => member.id)
  const availableUsers = users.filter((user) => !currentMemberIds.includes(user.id) && user.status === 'active')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedUserId) return
    setError('')
    setLoading(true)
    try {
      await api.addTeamMember(team.id, selectedUserId)
      onAdded()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title={`Add member to ${team.name}`} onClose={onClose}>
      {error ? <Alert variant='destructive'>{error}</Alert> : null}
      {availableUsers.length === 0 ? (
        <div className='space-y-4 text-center'>
          <p className='rounded-xl border border-dashed p-6 text-sm text-muted-foreground'>All active users are already members of this team.</p>
          <div className='flex justify-center'>
            <Button type='button' variant='outline' onClick={onClose}>Close</Button>
          </div>
        </div>
      ) : (
        <form className='space-y-4' onSubmit={handleSubmit}>
          <div className='space-y-2'>
            <Label htmlFor='team-member-user'>Select user</Label>
            <Select id='team-member-user' value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)} required>
              <option value=''>Choose a user...</option>
              {availableUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email}) - {user.role.replace('_', ' ')}
                </option>
              ))}
            </Select>
          </div>
          <div className='flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end'>
            <Button type='button' variant='outline' onClick={onClose}>Cancel</Button>
            <Button type='submit' disabled={loading || !selectedUserId}>{loading ? 'Adding...' : 'Add member'}</Button>
          </div>
        </form>
      )}
    </Modal>
  )
}
