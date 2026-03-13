const express = require('express')

const db = require('../db')
const { validateRequired } = require('../middleware/validate')
const { asyncHandler } = require('../utils/errors')

const router = express.Router()

router.get('/', asyncHandler(async (req, res) => {
  const teams = await db.getAllTeams()
  res.json(teams)
}))

router.get('/:id', asyncHandler(async (req, res) => {
  const team = await db.findTeam(req.params.id)
  if (!team) {
    return res.status(404).json({ error: 'Team not found' })
  }

  res.json(team)
}))

router.get('/:id/members', asyncHandler(async (req, res) => {
  const members = await db.getTeamMembers(req.params.id)
  if (!members) {
    return res.status(404).json({ error: 'Team not found' })
  }

  res.json(members)
}))

router.post('/', validateRequired(['name']), asyncHandler(async (req, res) => {
  const team = await db.createTeam({ name: req.body.name })
  res.status(201).json(team)
}))

router.post('/:id/members', validateRequired(['userId']), asyncHandler(async (req, res) => {
  const team = await db.addTeamMember(req.params.id, req.body.userId)
  if (!team) {
    return res.status(404).json({ error: 'Team or user not found' })
  }

  res.json(team)
}))

router.delete('/:id/members/:userId', asyncHandler(async (req, res) => {
  const team = await db.removeTeamMember(req.params.id, req.params.userId)
  if (!team) {
    return res.status(404).json({ error: 'Team not found' })
  }

  res.json(team)
}))

module.exports = router
