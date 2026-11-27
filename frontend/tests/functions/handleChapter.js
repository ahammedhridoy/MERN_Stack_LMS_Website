import uniqid from "uniqid";

export const defaultPrompt =
  typeof prompt !== "undefined" ? prompt : () => null;

export const handleChapter = (
  action,
  chapterId,
  chapters,
  setChapters,
  promptFn = defaultPrompt
) => {
  if (action === "add") {
    const title = promptFn("Enter chapter title");
    if (title) {
      const newChapter = {
        chapterId: uniqid(),
        chapterTitle: title,
        chapterContent: [],
        collapsed: false,
        chapterOrder:
          chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
      };
      setChapters([...chapters, newChapter]);
    }
  } else if (action === "remove") {
    setChapters(chapters.filter((chapter) => chapter.chapterId !== chapterId));
  } else if (action === "toggle") {
    setChapters(
      chapters.map((chapter) =>
        chapter.chapterId === chapterId
          ? { ...chapter, collapsed: !chapter.collapsed }
          : chapter
      )
    );
  }
};
