export function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('') || '?';
}

export function formatRole(role = '') {
  return role.replaceAll('_', ' ');
}

export function formatDate(value) {
  return new Date(value).toLocaleDateString();
}
