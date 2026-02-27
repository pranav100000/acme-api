/**
 * Generate initials from a full name (e.g. "Alice Chen" → "AC")
 * @param {string} name - Full name
 * @returns {string} Uppercase initials
 */
export function getInitials(name) {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('');
}

/**
 * Format a role string for display (e.g. "product_manager" → "product manager")
 * @param {string} role - Raw role string
 * @returns {string} Formatted role string
 */
export function formatRole(role) {
  if (!role) return '';
  return role.replace(/_/g, ' ');
}
