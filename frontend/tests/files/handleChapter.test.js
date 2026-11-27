import { describe, it, expect, vi } from "vitest";
import { handleChapter } from "../functions/handleChapter";

describe("handleChapter", () => {
  it("should add a chapter", () => {
    const fakePrompt = vi.fn().mockReturnValue("New Chapter");
    const chapters = [];
    const setChapters = vi.fn();

    handleChapter("add", null, chapters, setChapters, fakePrompt);

    expect(setChapters).toHaveBeenCalledWith([
      {
        chapterId: expect.any(String),
        chapterTitle: "New Chapter",
        chapterContent: [],
        collapsed: false,
        chapterOrder: 1,
      },
    ]);
  });

  it("should remove a chapter", () => {
    const chapters = [{ chapterId: "123", chapterTitle: "Chapter 1" }];
    const setChapters = vi.fn();

    handleChapter("remove", "123", chapters, setChapters);

    expect(setChapters).toHaveBeenCalledWith([]);
  });
});
