export function formatRelativeTime(dateString: string) {
  const now = Date.now();
  const postDate = new Date(dateString);
  const diff = now - postDate.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (seconds < 60) return `${seconds}s`;
  if (minutes < 60) return `${minutes}min`;
  if (hours < 24) return `${hours}h`;
  if (days < 7) return `${days}d`;

  const currentYear = new Date().getFullYear();
  const postYear = postDate.getFullYear();

  const options: Intl.DateTimeFormatOptions =
    currentYear === postYear
      ? { day: 'numeric', month: 'short' }
      : { day: 'numeric', month: 'short', year: '2-digit' };

  return postDate.toLocaleDateString('pt-BR', options).replace(/ de /g, ' ');
}

export function formatFullDateTime(dateString: string) {
  const postDate = new Date(dateString);

  const time = postDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  const date = postDate.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return `${time} • ${date}`;
}
