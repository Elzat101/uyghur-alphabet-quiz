export function getCompletedLessons() {
  const username = localStorage.getItem("username") || "guest";
  const key = `completedLessons_${username}`;
  return JSON.parse(localStorage.getItem(key) || "[]");
}

export function markLessonComplete(lessonId) {
  const username = localStorage.getItem("username") || "guest";
  const key = `completedLessons_${username}`;
  const current = getCompletedLessons();
  const updated = [...new Set([...current, lessonId])];
  localStorage.setItem(key, JSON.stringify(updated));
}
