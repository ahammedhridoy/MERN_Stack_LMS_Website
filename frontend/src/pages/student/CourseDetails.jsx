import React, { useContext, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import Loading from "../../components/student/Loading";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import Footer from "../../components/student/Footer";
import YouTube from "react-youtube";
import axios from "axios";
import { toast } from "react-toastify";
import DOMPurify from "dompurify";

const CourseDetails = () => {
  const { id } = useParams();

  const [courseData, setCourseData] = useState(null);
  const [openSections, setOpenSections] = useState({});
  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null);
  const [isEnrolling, setIsEnrolling] = useState(false);

  const {
    calculateRating,
    calculateChapterTime,
    calculateCourseDuration,
    calculateTotalLectures,
    currency,
    userData,
    backendUrl,
    getToken,
  } = useContext(AppContext);

  // Fetch Course Data
  const fetchCourseData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/course/" + id);

      if (data.success) {
        setCourseData(data.courseData);
        // Default open the first section
        setOpenSections({ 0: true });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Enroll course
  const enrollcourse = async () => {
    try {
      if (!userData) {
        return toast.warn("Please login to enroll in this course");
      }

      if (isAlreadyEnrolled) {
        return toast.info("You are already enrolled in this course");
      }

      setIsEnrolling(true);
      const token = await getToken();
      const { data } = await axios.post(
        backendUrl + "/api/user/purchase",
        { courseId: courseData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        const { session_url } = data;
        window.location.replace(session_url);
      } else {
        toast.error(data.message);
        setIsEnrolling(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
      setIsEnrolling(false);
    }
  };

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  useEffect(() => {
    fetchCourseData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (userData && courseData) {
      setIsAlreadyEnrolled(
        userData.enrolledCourses &&
          userData.enrolledCourses.includes(courseData._id)
      );
    }
  }, [userData, courseData]);

  if (!courseData) {
    return <Loading message="Loading course details..." />;
  }

  const rating = calculateRating(courseData);
  const discountedPrice = (
    courseData.coursePrice -
    ((courseData.discount || 0) * courseData.coursePrice) / 100
  ).toFixed(2);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/40">
      {/* Course Hero Banner */}
      <section className="relative w-full bg-gradient-to-b from-indigo-50/80 via-slate-50 to-transparent border-b border-slate-200/60 pt-8 pb-12 md:py-14 px-4 sm:px-8 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 mb-4">
            <Link to="/" className="hover:text-brand-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              to="/course-list"
              className="hover:text-brand-600 transition-colors"
            >
              Courses
            </Link>
            <span>/</span>
            <span className="font-semibold text-slate-800 truncate max-w-xs sm:max-w-md">
              {courseData.courseTitle}
            </span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Header Column */}
            <div className="lg:col-span-7">
              <span className="inline-block text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200/60 mb-3">
                Featured Program
              </span>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {courseData.courseTitle}
              </h1>

              {/* Short snippet */}
              <div
                className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed line-clamp-3"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(courseData.courseDescription || ""),
                }}
              />

              {/* Course Meta Info */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-6 pt-4 border-t border-slate-200/80 text-xs sm:text-sm text-slate-600">
                {/* Rating */}
                <div className="flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded font-bold text-xs bg-amber-50 text-amber-700 border border-amber-200">
                    {rating.toFixed(1)} ★
                  </span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <img
                        className="w-3.5 h-3.5"
                        key={i}
                        src={
                          i < Math.floor(rating)
                            ? assets.star
                            : assets.star_blank
                        }
                        alt=""
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                  <span className="text-slate-400">
                    ({courseData.courseRatings?.length || 0} reviews)
                  </span>
                </div>

                {/* Enrolled Students */}
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">•</span>
                  <span>
                    👥{" "}
                    <strong className="text-slate-800">
                      {courseData.enrolledStudents?.length || 0}
                    </strong>{" "}
                    students enrolled
                  </span>
                </div>

                {/* Instructor */}
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">•</span>
                  <span>
                    Created by{" "}
                    <strong className="text-brand-600 underline">
                      {courseData.educator?.name || "Expert Instructor"}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            {/* Right Sticky Enrollment Card Container */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 z-20">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-soft-xl overflow-hidden">
                {/* Video / Thumbnail preview */}
                <div className="relative aspect-video bg-slate-900 overflow-hidden group">
                  {playerData ? (
                    <YouTube
                      videoId={playerData.videoId}
                      opts={{
                        playerVars: { autoplay: 1 },
                        width: "100%",
                        height: "100%",
                      }}
                      className="w-full h-full"
                      iframeClassName="w-full h-full aspect-video"
                    />
                  ) : (
                    <>
                      <img
                        src={courseData.courseThumbnail}
                        alt={courseData.courseTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <span className="w-14 h-14 rounded-full bg-white/90 text-brand-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <img
                            src={assets.play_icon}
                            alt="Play"
                            className="w-6 h-6 ml-0.5"
                          />
                        </span>
                      </div>
                    </>
                  )}
                </div>

                <div className="p-6">
                  {/* Price Banner */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-3xl font-extrabold text-slate-900">
                        {currency}
                        {discountedPrice}
                      </span>
                      {courseData.discount > 0 && (
                        <span className="text-base text-slate-400 line-through">
                          {currency}
                          {courseData.coursePrice}
                        </span>
                      )}
                    </div>
                    {courseData.discount > 0 && (
                      <span className="px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full">
                        {courseData.discount}% OFF
                      </span>
                    )}
                  </div>

                  {/* Urgency Badge */}
                  <div className="flex items-center gap-1.5 mt-3 text-xs text-rose-600 font-medium">
                    <img
                      src={assets.time_left_clock_icon}
                      alt=""
                      className="w-3.5 h-3.5"
                    />
                    <span>Special promotional pricing ends soon!</span>
                  </div>

                  {/* Quick specs */}
                  <div className="grid grid-cols-3 gap-2 py-4 my-4 border-y border-slate-100 text-center text-xs text-slate-600">
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-slate-800 text-sm">
                        {calculateCourseDuration(courseData)}
                      </span>
                      <span className="text-slate-400">Total Length</span>
                    </div>
                    <div className="flex flex-col items-center border-x border-slate-100">
                      <span className="font-bold text-slate-800 text-sm">
                        {calculateTotalLectures(courseData)}
                      </span>
                      <span className="text-slate-400">Lectures</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="font-bold text-slate-800 text-sm">
                        Full
                      </span>
                      <span className="text-slate-400">Lifetime Access</span>
                    </div>
                  </div>

                  {/* Enroll CTA */}
                  <button
                    onClick={enrollcourse}
                    disabled={isAlreadyEnrolled || isEnrolling}
                    className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 shadow-sm cursor-pointer ${
                      isAlreadyEnrolled
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                        : isEnrolling
                        ? "bg-brand-500 text-white cursor-wait"
                        : "bg-brand-600 hover:bg-brand-700 active:scale-98 text-white shadow-soft-sm hover:shadow-soft-md"
                    }`}
                  >
                    {isAlreadyEnrolled
                      ? "Already Enrolled"
                      : isEnrolling
                      ? "Processing Enrollment..."
                      : "Enroll Now"}
                  </button>

                  {/* Course Features Checklist */}
                  <div className="mt-6 text-left">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
                      This comprehensive course includes:
                    </p>
                    <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                      {[
                        "Full lifetime access with all future updates",
                        "Step-by-step practical guided projects",
                        "Downloadable source code and project resources",
                        "Direct instructor Q&A support",
                        "Certificate of completion upon finishing",
                      ].map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-500 font-bold">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Course Details Content */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 md:px-12 lg:px-24 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-7">
            {/* Course Curriculum / Structure */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft-sm text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-2">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Course Curriculum
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    {courseData.courseContent.length} chapters •{" "}
                    {calculateTotalLectures(courseData)} lectures •{" "}
                    {calculateCourseDuration(courseData)} total length
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const allOpen = Object.keys(openSections).length === courseData.courseContent.length;
                    if (allOpen) {
                      setOpenSections({});
                    } else {
                      const newOpen = {};
                      courseData.courseContent.forEach((_, i) => (newOpen[i] = true));
                      setOpenSections(newOpen);
                    }
                  }}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-800 transition-colors cursor-pointer self-start sm:self-auto"
                >
                  {Object.keys(openSections).length === courseData.courseContent.length
                    ? "Collapse all chapters"
                    : "Expand all chapters"}
                </button>
              </div>

              {/* Accordion List */}
              <div className="mt-6 space-y-3">
                {courseData.courseContent.map((chapter, index) => (
                  <div
                    key={index}
                    className="border border-slate-200/80 rounded-2xl overflow-hidden transition-all duration-200"
                  >
                    <button
                      type="button"
                      className="w-full flex items-center justify-between p-4 bg-slate-50/70 hover:bg-slate-100/70 text-left transition-colors cursor-pointer select-none"
                      onClick={() => toggleSection(index)}
                      aria-expanded={!!openSections[index]}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={assets.down_arrow_icon}
                          alt=""
                          aria-hidden="true"
                          className={`w-4 h-4 transform transition-transform duration-200 opacity-60 ${
                            openSections[index] ? "rotate-180" : ""
                          }`}
                        />
                        <span className="font-semibold text-sm sm:text-base text-slate-800">
                          {chapter.chapterTitle}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>
                          {chapter.chapterContent.length} lectures
                        </span>
                        <span>•</span>
                        <span>{calculateChapterTime(chapter)}</span>
                      </div>
                    </button>

                    {openSections[index] && (
                      <div className="divide-y divide-slate-100 bg-white">
                        {chapter.chapterContent.map((lecture, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors text-xs sm:text-sm"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={assets.play_icon}
                                alt=""
                                aria-hidden="true"
                                className="w-3.5 h-3.5 opacity-60 shrink-0"
                              />
                              <span className="text-slate-700 font-medium">
                                {lecture.lectureTitle}
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              {lecture.isPreviewFree && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setPlayerData({
                                      videoId: lecture.lectureUrl
                                        ?.split("/")
                                        .pop(),
                                    })
                                  }
                                  className="text-xs font-bold text-brand-600 hover:text-brand-800 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200/60 cursor-pointer"
                                >
                                  Free Preview
                                </button>
                              )}
                              <span className="text-slate-400">
                                {humanizeDuration(
                                  lecture.lectureDuration * 60 * 1000,
                                  { units: ["h", "m"] }
                                )}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Course Description */}
            <div className="mt-8 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-soft-sm text-left">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
                About this Course
              </h2>
              <div
                className="rich-text leading-relaxed text-slate-600"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(courseData.courseDescription || ""),
                }}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CourseDetails;