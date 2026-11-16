import humanizeDuration from "humanize-duration";
import React, { useContext, useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { AppContext } from "../../context/AppContext";
import { useParams, Link } from "react-router-dom";
import Footer from "../../components/student/Footer";
import YouTube from "react-youtube";
import Rating from "../../components/student/Rating";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../../components/student/Loading";

const Player = () => {
  const [playerData, setPlayerData] = useState(null);
  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const { courseId } = useParams();
  const [progressData, setProgressData] = useState(null);
  const [initialRating, setInitialRating] = useState(0);
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);

  const {
    calculateChapterTime,
    enrolledCourses,
    backendUrl,
    getToken,
    fetchEnrolledCourses,
    userData,
  } = useContext(AppContext);

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const getCourseProgress = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/user/get-course-progress",
        { courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        setProgressData(data.progressData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchCourseData = () => {
    const course = enrolledCourses.find((c) => c._id === courseId);
    if (course) {
      setCourseData(course);
      course.courseRatings?.forEach((item) => {
        if (userData && item.userId === userData._id) {
          setInitialRating(item.rating);
        }
      });

      // Default to first lecture of first chapter if none active
      if (!playerData && course.courseContent?.[0]?.chapterContent?.[0]) {
        const firstLecture = course.courseContent[0].chapterContent[0];
        setPlayerData({
          ...firstLecture,
          chapter: 1,
          lecture: 1,
        });
        setOpenSections({ 0: true });
      }
    }
  };

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      fetchCourseData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enrolledCourses, courseId, userData]);

  useEffect(() => {
    getCourseProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const markLectureAsCompleted = async (lectureId) => {
    try {
      setIsUpdatingProgress(true);
      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/user/update-course-progress",
        { courseId, lectureId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        await getCourseProgress();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsUpdatingProgress(false);
    }
  };

  const handleRate = async (rating) => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/user/add-rating",
        { courseId, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message);
        fetchEnrolledCourses();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (!courseData) {
    return <Loading message="Loading course workspace..." />;
  }

  const isCurrentCompleted =
    playerData &&
    progressData?.lectureCompleted?.includes(playerData.lectureId);

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100">
      {/* Player Navigation Bar */}
      <header className="w-full bg-slate-950 border-b border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/my-enrollments"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <span>←</span>
            <span>Back to Dashboard</span>
          </Link>
          <span className="text-slate-700 hidden sm:inline">•</span>
          <span className="text-xs sm:text-sm font-medium text-slate-200 truncate max-w-xs sm:max-w-md hidden sm:inline">
            {courseData.courseTitle}
          </span>
        </div>

        {/* Rating component in header or right corner */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 hidden md:inline">Your rating:</span>
          <Rating initialRating={initialRating} onRate={handleRate} />
        </div>
      </header>

      {/* Main Workspace: Video Screen & Curriculum Sidebar */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Video Stage (Cols 8) */}
        <div className="lg:col-span-8 p-4 sm:p-6 lg:p-8 flex flex-col justify-start">
          {/* Cinema Frame */}
          <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
            {playerData?.lectureUrl ? (
              <YouTube
                videoId={playerData.lectureUrl.split("/").pop()}
                opts={{
                  playerVars: { autoplay: 1 },
                  width: "100%",
                  height: "100%",
                }}
                className="w-full h-full"
                iframeClassName="w-full h-full aspect-video"
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400">
                <img
                  src={courseData.courseThumbnail}
                  alt=""
                  className="w-full h-full object-cover opacity-30"
                />
                <p className="absolute font-semibold text-sm sm:text-base">
                  Select a lecture from the curriculum to begin
                </p>
              </div>
            )}
          </div>

          {/* Lecture Controls & Meta Bar */}
          {playerData && (
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-800/70 border border-slate-700/60">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-400 bg-brand-950/80 px-2.5 py-1 rounded-md border border-brand-800/60">
                  Lesson {playerData.chapter}.{playerData.lecture}
                </span>
                <h1 className="mt-2 text-lg sm:text-xl font-bold text-white">
                  {playerData.lectureTitle}
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Duration:{" "}
                  {humanizeDuration(playerData.lectureDuration * 60 * 1000, {
                    units: ["h", "m"],
                  })}
                </p>
              </div>

              <button
                type="button"
                disabled={isUpdatingProgress}
                onClick={() => markLectureAsCompleted(playerData.lectureId)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer self-start sm:self-auto shrink-0 shadow-sm ${
                  isCurrentCompleted
                    ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-600/30"
                    : "bg-brand-600 text-white hover:bg-brand-500 active:scale-95"
                }`}
              >
                <span>{isCurrentCompleted ? "✓ Completed" : "Mark as Completed"}</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Curriculum Panel (Cols 4) */}
        <aside className="lg:col-span-4 bg-slate-950/60 border-t lg:border-t-0 lg:border-l border-slate-800 p-4 sm:p-6 overflow-y-auto max-h-[85vh]">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
            <h2 className="font-bold text-base text-white">Course Content</h2>
            <span className="text-xs text-slate-400">
              {progressData?.lectureCompleted?.length || 0} completed
            </span>
          </div>

          <div className="space-y-3">
            {courseData.courseContent.map((chapter, index) => (
              <div
                key={index}
                className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/60"
              >
                {/* Chapter Accordion Header */}
                <button
                  type="button"
                  onClick={() => toggleSection(index)}
                  className="w-full flex items-center justify-between p-3.5 bg-slate-900 hover:bg-slate-850 text-left transition-colors cursor-pointer select-none"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={assets.down_arrow_icon}
                      alt=""
                      className={`w-3.5 h-3.5 transform transition-transform duration-200 brightness-0 invert opacity-60 ${
                        openSections[index] ? "rotate-180" : ""
                      }`}
                    />
                    <span className="font-semibold text-xs sm:text-sm text-slate-200">
                      {chapter.chapterTitle}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 shrink-0">
                    {calculateChapterTime(chapter)}
                  </span>
                </button>

                {/* Chapter Lectures */}
                {openSections[index] && (
                  <div className="divide-y divide-slate-850 bg-slate-950/40">
                    {chapter.chapterContent.map((lecture, i) => {
                      const isCompleted =
                        progressData?.lectureCompleted?.includes(
                          lecture.lectureId
                        );
                      const isCurrent =
                        playerData?.lectureId === lecture.lectureId;

                      return (
                        <div
                          key={i}
                          onClick={() => {
                            if (lecture.lectureUrl) {
                              setPlayerData({
                                ...lecture,
                                chapter: index + 1,
                                lecture: i + 1,
                              });
                            }
                          }}
                          className={`flex items-center justify-between p-3 cursor-pointer transition-colors text-xs ${
                            isCurrent
                              ? "bg-brand-950/60 border-l-4 border-brand-500 text-white font-medium"
                              : "hover:bg-slate-900 text-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold ${
                                isCompleted
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                  : isCurrent
                                  ? "bg-brand-500 text-white"
                                  : "bg-slate-800 text-slate-400"
                              }`}
                            >
                              {isCompleted ? "✓" : i + 1}
                            </span>
                            <span className="line-clamp-1">
                              {lecture.lectureTitle}
                            </span>
                          </div>

                          <span className="text-[11px] text-slate-500 shrink-0 ml-2">
                            {humanizeDuration(
                              lecture.lectureDuration * 60 * 1000,
                              { units: ["m"] }
                            )}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>
      </div>

      <Footer />
    </div>
  );
};

export default Player;