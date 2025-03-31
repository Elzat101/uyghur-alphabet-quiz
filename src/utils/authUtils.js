export function setUsername(newUsername) {
  // Remove guest progress
  localStorage.removeItem("completedLessons_guest");

  // Save current user
  localStorage.setItem("username", newUsername);

  const key = `completedLessons_${newUsername}`;
  const existing = localStorage.getItem(key);
  if (!existing) {
    localStorage.setItem(key, JSON.stringify([]));
  }
}

export function logoutUser() {
  const username = localStorage.getItem("username");

  // Set to guest
  localStorage.setItem("username", "guest");

  // If they were a guest, clear guest progress
  if (username === "guest") {
    localStorage.removeItem("completedLessons_guest");
  }
}
