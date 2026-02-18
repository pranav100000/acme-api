const express = require('express');
const db = require('../db');

const router = express.Router();

// GET /api/stats - Get summary statistics
router.get('/', async (req, res) => {
  const users = await db.getAllUsers();
  const teams = await db.getAllTeams();

  const activeUsers = users.filter(u => u.status === 'active').length;
  const inactiveUsers = users.filter(u => u.status === 'inactive').length;
  const pendingUsers = users.filter(u => u.status === 'pending').length;

  const roleCounts = {};
  for (const user of users) {
    roleCounts[user.role] = (roleCounts[user.role] || 0) + 1;
  }

  const totalMemberships = teams.reduce((sum, t) => sum + t.members.length, 0);

  res.json({
    users: {
      total: users.length,
      active: activeUsers,
      inactive: inactiveUsers,
      pending: pendingUsers,
      byRole: roleCounts,
    },
    teams: {
      total: teams.length,
      totalMemberships,
    },
  });
});

module.exports = router;
