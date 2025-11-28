import { db, doc, updateDoc, getDoc, setDoc } from './firebase-config.js';

// ==========================================
// SAVE COURSE PROGRESS
// ==========================================

export async function saveCourseProgress(userId, courseId, lessonId, completed = true) {
  try {
    const progressRef = doc(db, "users", userId);
    const userDoc = await getDoc(progressRef);
    
    if (userDoc.exists()) {
      const currentProgress = userDoc.data().progress || {};
      
      // Initialize course progress if not exists
      if (!currentProgress[courseId]) {
        currentProgress[courseId] = {
          startedAt: new Date().toISOString(),
          lessons: {}
        };
      }
      
      // Update lesson progress
      currentProgress[courseId].lessons[lessonId] = {
        completed: completed,
        completedAt: new Date().toISOString()
      };
      
      // Update last accessed
      currentProgress[courseId].lastAccessed = new Date().toISOString();
      
      // Calculate completion percentage
      const totalLessons = Object.keys(currentProgress[courseId].lessons).length;
      const completedLessons = Object.values(currentProgress[courseId].lessons)
        .filter(lesson => lesson.completed).length;
      currentProgress[courseId].completionPercentage = 
        Math.round((completedLessons / totalLessons) * 100);
      
      // Save to Firestore
      await updateDoc(progressRef, {
        progress: currentProgress,
        lastActivity: new Date().toISOString()
      });
      
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error saving progress:', error);
    return false;
  }
}

// ==========================================
// GET COURSE PROGRESS
// ==========================================

export async function getCourseProgress(userId, courseId) {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    
    if (userDoc.exists()) {
      const progress = userDoc.data().progress || {};
      return progress[courseId] || null;
    }
    return null;
  } catch (error) {
    console.error('Error getting progress:', error);
    return null;
  }
}

// ==========================================
// GET ALL USER PROGRESS
// ==========================================

export async function getAllProgress(userId) {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    
    if (userDoc.exists()) {
      return userDoc.data().progress || {};
    }
    return {};
  } catch (error) {
    console.error('Error getting all progress:', error);
    return {};
  }
}

// ==========================================
// CHECK IF LESSON IS COMPLETED
// ==========================================

export async function isLessonCompleted(userId, courseId, lessonId) {
  try {
    const progress = await getCourseProgress(userId, courseId);
    
    if (progress && progress.lessons && progress.lessons[lessonId]) {
      return progress.lessons[lessonId].completed;
    }
    return false;
  } catch (error) {
    console.error('Error checking lesson completion:', error);
    return false;
  }
}

// ==========================================
// SAVE QUIZ SCORE
// ==========================================

export async function saveQuizScore(userId, courseId, quizId, score, totalQuestions) {
  try {
    const progressRef = doc(db, "users", userId);
    const userDoc = await getDoc(progressRef);
    
    if (userDoc.exists()) {
      const currentProgress = userDoc.data().progress || {};
      
      if (!currentProgress[courseId]) {
        currentProgress[courseId] = {
          quizzes: {}
        };
      }
      
      if (!currentProgress[courseId].quizzes) {
        currentProgress[courseId].quizzes = {};
      }
      
      // Save quiz result
      currentProgress[courseId].quizzes[quizId] = {
        score: score,
        totalQuestions: totalQuestions,
        percentage: Math.round((score / totalQuestions) * 100),
        completedAt: new Date().toISOString()
      };
      
      await updateDoc(progressRef, {
        progress: currentProgress,
        lastActivity: new Date().toISOString()
      });
      
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error saving quiz score:', error);
    return false;
  }
}

// ==========================================
// GET USER ACHIEVEMENTS
// ==========================================

export async function getAchievements(userId) {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    
    if (userDoc.exists()) {
      const progress = userDoc.data().progress || {};
      
      // Calculate achievements
      const achievements = {
        totalCourses: Object.keys(progress).length,
        completedCourses: 0,
        totalLessons: 0,
        completedLessons: 0,
        averageScore: 0,
        badges: []
      };
      
      // Count completed courses and lessons
      Object.values(progress).forEach(course => {
        if (course.lessons) {
          achievements.totalLessons += Object.keys(course.lessons).length;
          achievements.completedLessons += Object.values(course.lessons)
            .filter(lesson => lesson.completed).length;
        }
        
        if (course.completionPercentage === 100) {
          achievements.completedCourses++;
        }
        
        // Calculate average quiz score
        if (course.quizzes) {
          const scores = Object.values(course.quizzes).map(q => q.percentage);
          if (scores.length > 0) {
            achievements.averageScore = Math.round(
              scores.reduce((a, b) => a + b, 0) / scores.length
            );
          }
        }
      });
      
      // Award badges
      if (achievements.completedLessons >= 10) {
        achievements.badges.push('Dedicated Learner');
      }
      if (achievements.completedCourses >= 1) {
        achievements.badges.push('Course Completer');
      }
      if (achievements.averageScore >= 90) {
        achievements.badges.push('Top Performer');
      }
      
      return achievements;
    }
    return null;
  } catch (error) {
    console.error('Error getting achievements:', error);
    return null;
  }
}