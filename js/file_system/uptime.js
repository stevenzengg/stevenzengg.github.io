export function uptime() {
  const birthDate = new Date("2000-02-14T00:00:00Z");
  const now = new Date();
  const diffMs = now - birthDate;

  const seconds = Math.floor(diffMs / 1000) % 60;
  const minutes = Math.floor(diffMs / (1000 * 60)) % 60;
  const hours = Math.floor(diffMs / (1000 * 60 * 60)) % 24;
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return `Steven has been alive for: ${days} days, ${hours} hours, ${minutes} minutes, and ${seconds} seconds.
    Note that this is an approximation, please do not try to doxx me.`;
}
