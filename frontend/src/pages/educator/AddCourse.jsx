import { useContext, useEffect, useRef, useState } from "react";
import Quill from "quill";
import { assets } from "../../assets/assets";
import uniqid from "uniqid";
import { toast } from "react-toastify";
import axios from "axios";
import { AppContext } from "../../context/AppContext";

const AddCourse = () => {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const [courseTitle, setCourseTitle] = useState("");
  const [coursePrice, setCoursePrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [image, setImage] = useState(null);
  const [chapters, setChapters] = useState([]);

  // Modals state
  const [showLecturePopup, setShowLecturePopup] = useState(false);
  const [showChapterPopup, setShowChapterPopup] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [currentChapterId, setCurrentChapterId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { backendUrl, getToken } = useContext(AppContext);

  const [lectureDetails, setLectureDetails] = useState({
    lectureTitle: "",
    lectureDuration: "",
    lectureUrl: "",
    isPreviewFree: false,
  });

  // Handle chapter
  const handleChapter = (action, chapterId) => {
    if (action === "add") {
      setShowChapterPopup(true);
    } else if (action === "remove") {
      setChapters(
        chapters.filter((chapter) => chapter.chapterId !== chapterId)
      );
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

  const submitAddChapter = (e) => {
    e.preventDefault();
    if (!newChapterTitle.trim()) {
      return toast.warn("Please enter a chapter title");
    }
    const newChapter = {
      chapterId: uniqid(),
      chapterTitle: newChapterTitle.trim(),
      chapterContent: [],
      collapsed: false,
      chapterOrder:
        chapters.length > 0 ? chapters.slice(-1)[0].chapterOrder + 1 : 1,
    };
    setChapters([...chapters, newChapter]);
    setNewChapterTitle("");
    setShowChapterPopup(false);
  };

  // Handle lecture
  const handleLecture = (action, chapterId, lectureIndex) => {
    if (action === "add") {
      setCurrentChapterId(chapterId);
      setShowLecturePopup(true);
    } else if (action === "remove") {
      setChapters(
        chapters.map((chapter) => {
          if (chapter.chapterId === chapterId) {
            const updatedContent = [...chapter.chapterContent];
            updatedContent.splice(lectureIndex, 1);
            return { ...chapter, chapterContent: updatedContent };
          }
          return chapter;
        })
      );
    }
  };

  // Add lecture
  const addLecture = (e) => {
    e.preventDefault();
    if (!lectureDetails.lectureTitle.trim()) {
      return toast.warn("Please enter a lecture title");
    }
    if (!lectureDetails.lectureDuration) {
      return toast.warn("Please enter lecture duration in minutes");
    }
    if (!lectureDetails.lectureUrl) {
      return toast.warn("Please enter lecture video URL");
    }

    setChapters(
      chapters.map((chapter) => {
        if (chapter.chapterId === currentChapterId) {
          const newLecture = {
            ...lectureDetails,
            lectureOrder:
              chapter.chapterContent.length > 0
                ? chapter.chapterContent.slice(-1)[0].lectureOrder + 1
                : 1,
            lectureId: uniqid(),
          };
          return {
            ...chapter,
            chapterContent: [...chapter.chapterContent, newLecture],
          };
        }
        return chapter;
      })
    );

    setShowLecturePopup(false);
    setLectureDetails({
      lectureTitle: "",
      lectureDuration: "",
      lectureUrl: "",
      isPreviewFree: false,
    });
  };

  // Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      return toast.error("Please upload a course thumbnail image");
    }

    const description = quillRef.current?.root.innerHTML || "";
    if (!description || description === "<p><br></p>") {
      return toast.error("Please provide a course description");
    }

    if (chapters.length === 0) {
      return toast.error("Please add at least one chapter with lectures");
    }

    try {
      setIsSubmitting(true);
      const courseData = {
        courseTitle,
        courseDescription: description,
        coursePrice: Number(coursePrice),
        discount: Number(discount),
        courseContent: chapters,
      };

      const formData = new FormData();
      formData.append("courseData", JSON.stringify(courseData));
      formData.append("image", image);

      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/educator/add-course",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        toast.success(data.message || "Course published successfully!");
        setCourseTitle("");
        setCoursePrice(0);
        setDiscount(0);
        setImage(null);
        setChapters([]);
        if (quillRef.current) quillRef.current.root.innerHTML = "";
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to add course");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Quill initialization
  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Write a comprehensive course outline, syllabus, and key takeaways...",
      });
    }
  }, []);

  return (
    <div className="flex-1 p-6 md:p-10 bg-slate-50/50 min-h-screen text-left">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-slate-200 pb-5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Create & Publish Course
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Structure your lectures, set pricing, upload media, and launch your curriculum to the world.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Basic Information */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-soft-sm space-y-6">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              1. Basic Information
            </h2>

            {/* Course Title */}
            <div>
              <label
                htmlFor="courseTitle"
                className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2"
              >
                Course Title <span className="text-rose-500">*</span>
              </label>
              <input
                id="courseTitle"
                type="text"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                placeholder="e.g. Master Full-Stack Web Development with React & Node.js"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium text-slate-800 placeholder-slate-400"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Course Description <span className="text-rose-500">*</span>
              </label>
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <div ref={editorRef} className="min-h-[160px] text-sm text-slate-700"></div>
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & Media */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-soft-sm space-y-6">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              2. Pricing & Thumbnail
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Course Price */}
              <div>
                <label
                  htmlFor="coursePrice"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2"
                >
                  Price (USD $) <span className="text-rose-500">*</span>
                </label>
                <input
                  id="coursePrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={coursePrice}
                  onChange={(e) => setCoursePrice(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium text-slate-800"
                  required
                />
              </div>

              {/* Discount Percentage */}
              <div>
                <label
                  htmlFor="discount"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2"
                >
                  Promotional Discount (%)
                </label>
                <input
                  id="discount"
                  type="number"
                  min="0"
                  max="100"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm font-medium text-slate-800"
                />
              </div>
            </div>

            {/* Thumbnail Upload */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Course Thumbnail <span className="text-rose-500">*</span>
              </label>

              <label
                htmlFor="thumbnailImage"
                className="flex flex-col sm:flex-row items-center gap-4 p-4 border-2 border-dashed border-slate-200 hover:border-brand-500 rounded-2xl cursor-pointer bg-slate-50/50 hover:bg-brand-50/20 transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-xl bg-brand-100 flex items-center justify-center shrink-0">
                  <img
                    src={assets.file_upload_icon}
                    alt=""
                    className="w-6 h-6 brightness-0 invert"
                  />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-sm font-semibold text-slate-800">
                    Click to upload thumbnail
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    PNG, JPG or WEBP (Recommended 16:9 ratio, min 1280x720)
                  </p>
                </div>
                <input
                  type="file"
                  id="thumbnailImage"
                  onChange={(e) => setImage(e.target.files[0])}
                  accept="image/*"
                  hidden
                />
                {image && (
                  <div className="relative shrink-0">
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Thumbnail Preview"
                      className="w-24 h-14 object-cover rounded-lg border shadow-xs"
                    />
                  </div>
                )}
              </label>
            </div>
          </div>

          {/* Section 3: Curriculum & Chapters */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-soft-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  3. Curriculum & Chapters
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Organize your course into logical chapters and video lectures.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleChapter("add")}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 rounded-xl transition-all cursor-pointer"
              >
                <span>+ Add Chapter</span>
              </button>
            </div>

            {/* Chapters List */}
            {chapters.length > 0 ? (
              <div className="space-y-4">
                {chapters.map((chapter, index) => (
                  <div
                    key={chapter.chapterId}
                    className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50"
                  >
                    <div className="flex items-center justify-between p-4 bg-white border-b border-slate-200/80">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleChapter("toggle", chapter.chapterId)}
                          className="p-1 hover:bg-slate-100 rounded cursor-pointer"
                        >
                          <img
                            src={assets.dropdown_icon}
                            alt=""
                            className={`w-3.5 h-3.5 transform transition-transform duration-200 ${
                              chapter.collapsed ? "-rotate-90" : ""
                            }`}
                          />
                        </button>
                        <span className="font-bold text-sm text-slate-800">
                          Chapter {index + 1}: {chapter.chapterTitle}
                        </span>
                        <span className="text-xs text-slate-400">
                          ({chapter.chapterContent.length} lectures)
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleChapter("remove", chapter.chapterId)}
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        aria-label="Remove chapter"
                      >
                        <img src={assets.cross_icon} alt="" className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {!chapter.collapsed && (
                      <div className="p-4 space-y-2">
                        {chapter.chapterContent.map((lecture, lIdx) => (
                          <div
                            key={lecture.lectureId || lIdx}
                            className="flex items-center justify-between p-3 bg-white border border-slate-200/70 rounded-xl text-xs sm:text-sm"
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-700">
                                {lIdx + 1}. {lecture.lectureTitle}
                              </span>
                              <span className="text-slate-400">
                                • {lecture.lectureDuration} mins
                              </span>
                              {lecture.isPreviewFree && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  Free Preview
                                </span>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                handleLecture("remove", chapter.chapterId, lIdx)
                              }
                              className="text-slate-400 hover:text-rose-600 p-1"
                            >
                              <img
                                src={assets.cross_icon}
                                alt=""
                                className="w-3 h-3"
                              />
                            </button>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => handleLecture("add", chapter.chapterId)}
                          className="mt-2 w-full py-2.5 border border-dashed border-brand-300 text-brand-600 hover:bg-brand-50/50 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-center"
                        >
                          + Add Lecture to this Chapter
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-2xl">
                <p className="text-sm text-slate-500">
                  No chapters created yet.
                </p>
                <button
                  type="button"
                  onClick={() => handleChapter("add")}
                  className="mt-3 px-4 py-2 text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors cursor-pointer"
                >
                  Create First Chapter
                </button>
              </div>
            )}
          </div>

          {/* Form Submit Action */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-8 py-3.5 text-sm sm:text-base font-bold text-white rounded-xl shadow-soft-md transition-all duration-200 cursor-pointer ${
                isSubmitting
                  ? "bg-brand-400 cursor-wait"
                  : "bg-brand-600 hover:bg-brand-700 active:scale-95"
              }`}
            >
              {isSubmitting ? "Publishing Course..." : "Publish Course Now"}
            </button>
          </div>
        </form>

        {/* Modal: Add Chapter Dialog */}
        {showChapterPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <div className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-base">
                  Add New Chapter
                </h3>
                <button
                  type="button"
                  onClick={() => setShowChapterPopup(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <img src={assets.cross_icon} alt="" className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={submitAddChapter} className="mt-4 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Chapter Title
                  </label>
                  <input
                    type="text"
                    value={newChapterTitle}
                    onChange={(e) => setNewChapterTitle(e.target.value)}
                    placeholder="e.g. Introduction & Fundamentals"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    autoFocus
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowChapterPopup(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-xs cursor-pointer"
                  >
                    Add Chapter
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Add Lecture Dialog */}
        {showLecturePopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
            <div className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-base">
                  Add Video Lecture
                </h3>
                <button
                  type="button"
                  onClick={() => setShowLecturePopup(false)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <img src={assets.cross_icon} alt="" className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={addLecture} className="mt-4 space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Lecture Title
                  </label>
                  <input
                    type="text"
                    value={lectureDetails.lectureTitle}
                    onChange={(e) =>
                      setLectureDetails({
                        ...lectureDetails,
                        lectureTitle: e.target.value,
                      })
                    }
                    placeholder="e.g. Setting Up Your Development Environment"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={lectureDetails.lectureDuration}
                    onChange={(e) =>
                      setLectureDetails({
                        ...lectureDetails,
                        lectureDuration: e.target.value,
                      })
                    }
                    placeholder="15"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    YouTube Video URL
                  </label>
                  <input
                    type="text"
                    value={lectureDetails.lectureUrl}
                    onChange={(e) =>
                      setLectureDetails({
                        ...lectureDetails,
                        lectureUrl: e.target.value,
                      })
                    }
                    placeholder="https://youtu.be/dQw4w9WgXcQ"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <input
                    id="previewFree"
                    type="checkbox"
                    checked={lectureDetails.isPreviewFree}
                    onChange={(e) =>
                      setLectureDetails({
                        ...lectureDetails,
                        isPreviewFree: e.target.checked,
                      })
                    }
                    className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 border-slate-300 cursor-pointer"
                  />
                  <label
                    htmlFor="previewFree"
                    className="text-xs font-medium text-slate-700 cursor-pointer select-none"
                  >
                    Allow Free Preview for students
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowLecturePopup(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-xs cursor-pointer"
                  >
                    Save Lecture
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddCourse;