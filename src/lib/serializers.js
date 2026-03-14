const getInitials = (value = '') =>
  value
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('');

const serializeUserSummary = (user) => ({
  id: user.id,
  email: user.email,
  name: user.name,
  role: user.role,
});

const serializeUserProfile = (user) => ({
  displayName: user.name,
  email: user.email,
  initials: getInitials(user.name),
});

module.exports = {
  getInitials,
  serializeUserProfile,
  serializeUserSummary,
};
