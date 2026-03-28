const getInitials = (name = '') => (
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
);

const toUserSummary = ({ id, email, name, role }) => ({
  id,
  email,
  name,
  role,
});

const toUserProfile = ({ name, email }) => ({
  displayName: name,
  email,
  initials: getInitials(name),
});

module.exports = {
  getInitials,
  toUserSummary,
  toUserProfile,
};
