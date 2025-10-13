import { describe, it, expect, vi } from "vitest";
import { handleChapter } from "../functions/handleChapter";

describe("handleChapter", () => {
  it("should add a chapter", () => {
    const fakePrompt = vi.fn().mockReturnValue("New Chapter");
    const chapters = [];
    const setChapters = vi.fn();

    handleChapter("add", null, chapters, setChapters, fakePrompt);
  });
});
