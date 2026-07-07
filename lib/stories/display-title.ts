/** Short, neat label for story cards — full YouTube title stays in modal/SEO. */
export function getStoryCardTitle(fullTitle: string, maxLen = 42): string {
  let text = fullTitle.trim();

  const beforeColon = text.split(":")[0]?.trim() ?? text;
  if (beforeColon.length >= 6 && beforeColon.length <= 55 && text.includes(":")) {
    text = beforeColon;
  }

  if (text.includes("|")) {
    const beforePipe = text.split("|")[0]?.trim() ?? text;
    if (beforePipe.length <= maxLen) text = beforePipe;
  }

  if (text === text.toUpperCase() && text.length > 4) {
    text = text
      .toLowerCase()
      .replace(/\b[\w']+/g, (word) => word.charAt(0).toUpperCase() + word.slice(1));
  }

  if (text.length > maxLen) {
    const slice = text.slice(0, maxLen + 1);
    const breakAt = slice.lastIndexOf(" ");
    text = `${(breakAt > 18 ? slice.slice(0, breakAt) : text.slice(0, maxLen)).trim()}…`;
  }

  return text;
}

export function getStoryCardLabel(video: { title: string; cardTitle?: string }): string {
  return video.cardTitle?.trim() || getStoryCardTitle(video.title);
}
