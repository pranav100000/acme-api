export function getInitials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export function showTimedMessage(setter, message, duration = 3000) {
  setter(message);
  return window.setTimeout(() => setter(''), duration);
}
