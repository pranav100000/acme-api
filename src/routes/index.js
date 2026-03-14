const healthRoutes = require('./health');
const authRoutes = require('./auth');
const teamRoutes = require('./teams');
const userRoutes = require('./users');

function registerRoutes(app) {
  app.use(healthRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/teams', teamRoutes);
  app.use('/api/users', userRoutes);
}

module.exports = { registerRoutes };
