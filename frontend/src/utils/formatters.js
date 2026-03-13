export function formatDate(value) {
  return new Date(value).toLocaleDateString();
}

export function formatRole(role) {
  return role.replace('_', ' ');
}

export function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('');
}
