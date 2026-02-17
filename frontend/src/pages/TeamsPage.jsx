/**
 * @module TeamsPage
 * @description Teams management page. Allows viewing, creating, and managing
 * teams and their member assignments.
 */

import React, { useState, useEffect } from 'react';
import * as api from '../api';
import Modal from '../components/Modal';

/**
 * Teams management page component.
 * Displays a grid of team cards with member lists and provides modals
 * for creating new teams and adding/removing members.
 *
 * @returns {JSX.Element} The teams page
 */
export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [teamMembers, setTeamMembers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [addMemberTeam, setAddMemberTeam] = useState(null);

  /**
   * Loads all teams, users, and team membership data from the API.
   * Populates the teams, users, and teamMembers state.
   */
  const loadData = async () => {
    try {
      const [teamsData, usersData] = await Promise.all([
        api.getTeams(),
        api.getUsers(),
      ]);
      setTeams(teamsData);
      setUsers(usersData);

      // Load members for each team
      const membersMap = {};
      await Promise.all(
        teamsData.map(async (team) => {
          try {
            const members = await api.getTeamMembers(team.id);
            membersMap[team.id] = members;
          } catch {
            membersMap[team.id] = [];
          }
        })
      );
      setTeamMembers(membersMap);
    } catch (err) {
      setError('Failed to load teams');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  /**
   * Removes a member from a team after user confirmation.
   * @param {string} teamId - The team's unique identifier
   * @param {string} userId - The user's unique identifier
   * @param {string} userName - The user's display name (used in confirmation dialog)
   */
  const handleRemoveMember = async (teamId, userId, userName) => {
    if (!window.confirm(`Remove ${userName} from this team?`)) return;
    try {
      await api.removeTeamMember(teamId, userId);
      setSuccess(`${userName} removed from team`);
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading) {
    return (
      <>
        <div className="page-header"><h2>Teams</h2></div>
        <div className="page-body"><div className="loading"><div className="spinner"></div></div></div>
      </>
    );
  }

  return (
    <>
      <div className="page-header">
        <h2>Teams</h2>
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
          + Create Team
        </button>
      </div>
      <div className="page-body">
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {teams.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏷️</div>
            <p>No teams yet. Create your first team!</p>
          </div>
        ) : (
          <div className="teams-grid">
            {teams.map(team => {
              const members = teamMembers[team.id] || [];
              return (
                <div key={team.id} className="team-card">
                  <div className="team-card-header">
                    <h3>{team.name}</h3>
                    <span style={{ fontSize: '13px', color: '#6b7280' }}>
                      {members.length} member{members.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="team-card-body">
                    <div className="team-meta">
                      Created {new Date(team.createdAt).toLocaleDateString()} · Updated {new Date(team.updatedAt).toLocaleDateString()}
                    </div>

                    {members.length === 0 ? (
                      <div style={{ padding: '16px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
                        No members yet
                      </div>
                    ) : (
                      <div className="member-list">
                        {members.map(member => member && (
                          <div key={member.id} className="member-item">
                            <div className="member-info">
                              <div className="member-avatar">
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <div style={{ fontWeight: 500, fontSize: '14px' }}>{member.name}</div>
                                <div style={{ fontSize: '12px', color: '#6b7280' }}>{member.role.replace('_', ' ')}</div>
                              </div>
                            </div>
                            <button
                              className="btn-icon"
                              title="Remove member"
                              onClick={() => handleRemoveMember(team.id, member.id, member.name)}
                              style={{ fontSize: '16px' }}
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div style={{ marginTop: '16px' }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        style={{ width: '100%', justifyContent: 'center' }}
                        onClick={() => setAddMemberTeam(team)}
                      >
                        + Add Member
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateTeamModal
          onClose={() => setShowCreateModal(false)}
          onCreated={() => { setShowCreateModal(false); loadData(); setSuccess('Team created successfully'); setTimeout(() => setSuccess(''), 3000); }}
        />
      )}

      {addMemberTeam && (
        <AddMemberModal
          team={addMemberTeam}
          users={users}
          currentMembers={teamMembers[addMemberTeam.id] || []}
          onClose={() => setAddMemberTeam(null)}
          onAdded={() => { setAddMemberTeam(null); loadData(); setSuccess('Member added successfully'); setTimeout(() => setSuccess(''), 3000); }}
        />
      )}
    </>
  );
}

/**
 * Modal form for creating a new team.
 *
 * @param {Object} props
 * @param {Function} props.onClose - Callback to close the modal
 * @param {Function} props.onCreated - Callback invoked after successful team creation
 * @returns {JSX.Element} The create team modal
 */
function CreateTeamModal({ onClose, onCreated }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.createTeam({ name });
      onCreated();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Create Team" onClose={onClose}>
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Team Name</label>
          <input
            className="form-control"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            placeholder="e.g. Marketing"
            autoFocus
          />
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Team'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

/**
 * Modal form for adding a member to a team.
 * Filters out users who are already members or inactive.
 *
 * @param {Object} props
 * @param {Object} props.team - The team to add a member to
 * @param {Object[]} props.users - All available users
 * @param {Object[]} props.currentMembers - Users currently in the team
 * @param {Function} props.onClose - Callback to close the modal
 * @param {Function} props.onAdded - Callback invoked after successfully adding a member
 * @returns {JSX.Element} The add member modal
 */
function AddMemberModal({ team, users, currentMembers, onClose, onAdded }) {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const currentMemberIds = currentMembers.filter(Boolean).map(m => m.id);
  const availableUsers = users.filter(u => !currentMemberIds.includes(u.id) && u.status === 'active');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUserId) return;
    setError('');
    setLoading(true);
    try {
      await api.addTeamMember(team.id, selectedUserId);
      onAdded();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title={`Add Member to ${team.name}`} onClose={onClose}>
      {error && <div className="alert alert-error">{error}</div>}
      {availableUsers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '24px', color: '#6b7280' }}>
          <p>All active users are already members of this team.</p>
          <div className="form-actions" style={{ justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select User</label>
            <select className="form-control" value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)} required>
              <option value="">Choose a user...</option>
              {availableUsers.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email}) - {user.role.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading || !selectedUserId}>
              {loading ? 'Adding...' : 'Add Member'}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
