import { useEffect, useState } from "react";
import API_URL from "../api";

function ProgressTracking() {
  const PROGRESS_API_URL = `${API_URL}/api/progress`;

  const [milestones, setMilestones] = useState([]);
  const [courses, setCourses] = useState([]);
  const [skills, setSkills] = useState([]);
  const [badges, setBadges] = useState([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Get JWT token
  const token = localStorage.getItem("token");

  // ========================================
  // LOAD PROGRESS
  // ========================================
  useEffect(() => {
    const loadProgress = async () => {
      if (!token) {
        setMessage("Please login to view your progress.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(PROGRESS_API_URL, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load progress"
          );
        }

        const progress = data.progress;

        // Load milestones
        setMilestones(
          (progress.milestones || []).map((item, index) => ({
            id: item._id || index + 1,
            title: item.title,
            completed: item.completed,
          }))
        );

        // Load courses
        setCourses(
          (progress.courses || []).map((item, index) => ({
            id: item._id || index + 1,
            name: item.name,
            completed: item.completed,
          }))
        );

        // Load skills
        setSkills(progress.skills || []);

        // Load badges
        setBadges(progress.badges || []);
      } catch (error) {
        console.error("Load Progress Error:", error);
        setMessage("Failed to load progress.");
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [token]);

  // ========================================
  // SAVE / TOGGLE MILESTONE
  // ========================================
  const toggleMilestone = async (id) => {
    const selectedMilestone = milestones.find(
      (milestone) => milestone.id === id
    );

    if (!selectedMilestone) {
      return;
    }

    const newStatus = !selectedMilestone.completed;

    // Update UI immediately
    setMilestones((prev) =>
      prev.map((milestone) =>
        milestone.id === id
          ? {
              ...milestone,
              completed: newStatus,
            }
          : milestone
      )
    );

    // Save only when completing
    if (newStatus && token) {
      try {
        setMessage("Saving milestone...");

        const response = await fetch(
          `${PROGRESS_API_URL}/milestone`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              milestone: selectedMilestone.title,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to save milestone"
          );
        }

        setMessage("Milestone saved successfully!");

        await loadProgressAgain();

        setTimeout(() => {
          setMessage("");
        }, 2000);
      } catch (error) {
        console.error("Milestone Error:", error);

        setMessage("Failed to save milestone.");

        // Restore previous state
        setMilestones((prev) =>
          prev.map((milestone) =>
            milestone.id === id
              ? {
                  ...milestone,
                  completed: selectedMilestone.completed,
                }
              : milestone
          )
        );
      }
    }
  };

  // ========================================
  // SAVE / TOGGLE COURSE
  // ========================================
  const toggleCourse = async (id) => {
    const selectedCourse = courses.find(
      (course) => course.id === id
    );

    if (!selectedCourse) {
      return;
    }

    const newStatus = !selectedCourse.completed;

    // Update UI immediately
    setCourses((prev) =>
      prev.map((course) =>
        course.id === id
          ? {
              ...course,
              completed: newStatus,
            }
          : course
      )
    );

    // Save only when completing
    if (newStatus && token) {
      try {
        setMessage("Saving course...");

        const response = await fetch(
          `${PROGRESS_API_URL}/course`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              course: selectedCourse.name,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to save course"
          );
        }

        setMessage("Course saved successfully!");

        await loadProgressAgain();

        setTimeout(() => {
          setMessage("");
        }, 2000);
      } catch (error) {
        console.error("Course Error:", error);

        setMessage("Failed to save course.");

        // Restore previous state
        setCourses((prev) =>
          prev.map((course) =>
            course.id === id
              ? {
                  ...course,
                  completed: selectedCourse.completed,
                }
              : course
          )
        );
      }
    }
  };

  // ========================================
  // RELOAD PROGRESS
  // ========================================
  const loadProgressAgain = async () => {
    if (!token) {
      return;
    }

    try {
      const response = await fetch(PROGRESS_API_URL, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to reload progress"
        );
      }

      const progress = data.progress;

      // Reload milestones
      setMilestones(
        (progress.milestones || []).map((item, index) => ({
          id: item._id || index + 1,
          title: item.title,
          completed: item.completed,
        }))
      );

      // Reload courses
      setCourses(
        (progress.courses || []).map((item, index) => ({
          id: item._id || index + 1,
          name: item.name,
          completed: item.completed,
        }))
      );

      // Reload skills
      setSkills(progress.skills || []);

      // Reload badges
      setBadges(progress.badges || []);
    } catch (error) {
      console.error("Reload Progress Error:", error);
    }
  };

  // ========================================
  // COMPLETED MILESTONES
  // ========================================
  const completedMilestones = milestones.filter(
    (milestone) => milestone.completed
  ).length;

  // ========================================
  // COMPLETED COURSES
  // ========================================
  const completedCourses = courses.filter(
    (course) => course.completed
  ).length;

  // ========================================
  // MILESTONE PROGRESS
  // ========================================
  const milestonePercentage =
    milestones.length > 0
      ? (completedMilestones / milestones.length) * 100
      : 0;

  // ========================================
  // COURSE PROGRESS
  // ========================================
  const coursePercentage =
    courses.length > 0
      ? (completedCourses / courses.length) * 100
      : 0;

  // ========================================
  // AVERAGE SKILL PROGRESS
  // ========================================
  const skillPercentage =
    skills.length > 0
      ? skills.reduce(
          (total, skill) => total + skill.progress,
          0
        ) / skills.length
      : 0;

  // ========================================
  // OVERALL PROGRESS
  // ========================================
  const progressPercentage = Math.round(
    (milestonePercentage +
      coursePercentage +
      skillPercentage) /
      3
  );

  return (
    <div className="progress-page">

      {/* ========================================
          PAGE HEADER
      ======================================== */}
      <h1>📈 Progress Tracking</h1>

      <p>
        Track your learning milestones, completed courses,
        skills, and achievements.
      </p>

      {/* ========================================
          MESSAGE
      ======================================== */}
      {message && (
        <div className="progress-message">
          {message}
        </div>
      )}

      {/* ========================================
          LOADING
      ======================================== */}
      {loading ? (
        <div className="progress-card">
          <h2>Loading Progress...</h2>

          <p>
            Please wait while we load your saved progress.
          </p>
        </div>
      ) : (
        <>
          {/* ========================================
              OVERALL PROGRESS
          ======================================== */}
          <div className="progress-card">

            <h2>🎯 Overall Progress</h2>

            <h3>
              {progressPercentage}% Completed
            </h3>

            <progress
              value={progressPercentage}
              max="100"
            />

          </div>

          {/* ========================================
              LEARNING MILESTONES
          ======================================== */}
          <div className="progress-card">

            <h2>🏆 Learning Milestones</h2>

            {milestones.length === 0 ? (
              <p>
                No learning milestones available.
              </p>
            ) : (
              milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="progress-item"
                >

                  <input
                    type="checkbox"
                    checked={milestone.completed}
                    onChange={() =>
                      toggleMilestone(milestone.id)
                    }
                  />

                  <span>
                    {milestone.title}
                  </span>

                  {milestone.completed && (
                    <strong>
                      {" "}✅ Completed
                    </strong>
                  )}

                </div>
              ))
            )}

          </div>

          {/* ========================================
              COURSES
          ======================================== */}
          <div className="progress-card">

            <h2>📚 Completed Courses</h2>

            {courses.length === 0 ? (
              <p>
                No courses available.
              </p>
            ) : (
              courses.map((course) => (
                <div
                  key={course.id}
                  className="progress-item"
                >

                  <input
                    type="checkbox"
                    checked={course.completed}
                    onChange={() =>
                      toggleCourse(course.id)
                    }
                  />

                  <span>
                    {course.name}
                  </span>

                  {course.completed && (
                    <strong>
                      {" "}✅ Completed
                    </strong>
                  )}

                </div>
              ))
            )}

          </div>

          {/* ========================================
              SKILL PROGRESS
          ======================================== */}
          <div className="progress-card">

            <h2>🛠️ Skill Progress</h2>

            {skills.length === 0 ? (
              <p>
                No skill progress available.
              </p>
            ) : (
              skills.map((skill) => (
                <div
                  key={skill._id || skill.name}
                  className="skill-progress"
                >

                  <div className="skill-header">

                    <span>
                      {skill.name}
                    </span>

                    <strong>
                      {skill.progress}%
                    </strong>

                  </div>

                  <progress
                    value={skill.progress}
                    max="100"
                  />

                </div>
              ))
            )}

          </div>

          {/* ========================================
              ACHIEVEMENT BADGES
          ======================================== */}
          <div className="progress-card">

            <h2>🏅 Achievement Badges</h2>

            <div className="badges">

              {/* Database badges */}
              {badges.length === 0 ? (
                <p>
                  No badges earned yet.
                </p>
              ) : (
                badges.map((badge) => (
                  <div
                    key={badge._id || badge.name}
                    className="badge"
                  >

                    🏅

                    <span>
                      {badge.name}
                    </span>

                  </div>
                ))
              )}

              {/* Assessment Completed */}
              {completedMilestones >= 1 &&
                !badges.some(
                  (badge) =>
                    badge.name ===
                    "Assessment Completed"
                ) && (
                  <div className="badge">

                    📝

                    <span>
                      Assessment Completed
                    </span>

                  </div>
                )}

              {/* First Course Completed */}
              {completedCourses >= 1 &&
                !badges.some(
                  (badge) =>
                    badge.name ===
                    "First Course Completed"
                ) && (
                  <div className="badge">

                    📚

                    <span>
                      First Course Completed
                    </span>

                  </div>
                )}

              {/* Learning Champion */}
              {completedMilestones >= 3 && (
                <div className="badge">

                  🏆

                  <span>
                    Learning Champion
                  </span>

                </div>
              )}

              {/* Career Ready */}
              {progressPercentage === 100 && (
                <div className="badge">

                  🌟

                  <span>
                    Career Ready
                  </span>

                </div>
              )}

            </div>

          </div>
        </>
      )}

    </div>
  );
}

export default ProgressTracking;