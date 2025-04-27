// src/lessonLoader.js

const requireLesson = require.context(
  "./progression-data-complete",
  true,
  /\.js$/
);

const lessonDataMap = {};

requireLesson.keys().forEach((filename) => {
  const lesson = requireLesson(filename).default;
  if (lesson?.id) {
    lessonDataMap[lesson.id] = lesson;
  }
});

export { lessonDataMap };
