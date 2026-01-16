require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Data file paths
const DATA_DIR = path.join(__dirname, 'data');
const COURSES_FILE = path.join(DATA_DIR, 'courses.json');
const CHALLENGES_FILE = path.join(DATA_DIR, 'challenges.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize courses file if it doesn't exist
if (!fs.existsSync(COURSES_FILE)) {
  const initialData = {
    courses: []
  };
  fs.writeFileSync(COURSES_FILE, JSON.stringify(initialData, null, 2));
}

// Initialize challenges file if it doesn't exist
if (!fs.existsSync(CHALLENGES_FILE)) {
  const initialData = {
    challenge: null
  };
  fs.writeFileSync(CHALLENGES_FILE, JSON.stringify(initialData, null, 2));
}

// Helper functions
const readCourses = () => {
  try {
    const data = fs.readFileSync(COURSES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading courses:', error);
    return { courses: [] };
  }
};

const writeCourses = (data) => {
  try {
    fs.writeFileSync(COURSES_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing courses:', error);
    return false;
  }
};

const readChallenge = () => {
  try {
    const data = fs.readFileSync(CHALLENGES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading challenge:', error);
    return { challenge: null };
  }
};

const writeChallenge = (data) => {
  try {
    fs.writeFileSync(CHALLENGES_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing challenge:', error);
    return false;
  }
};

// Verify admin password
const verifyAdmin = (password) => {
  return password === process.env.ADMIN_PASSWORD;
};

// Routes

// Get all courses (public - no URLs exposed)
app.get('/api/courses', (req, res) => {
  try {
    const data = readCourses();
    // Remove Facebook URLs from public response
    const publicCourses = data.courses.map(course => ({
      ...course,
      lessons: course.lessons.map(lesson => ({
        id: lesson.id,
        title: lesson.title,
        description: lesson.description,
        duration: lesson.duration,
        order: lesson.order
        // fbUrl is intentionally omitted
      }))
    }));
    res.json({ courses: publicCourses });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: 'Password is required' });
  }

  if (verifyAdmin(password)) {
    res.json({ success: true, message: 'Login successful' });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

// Get all courses with Facebook URLs (admin only)
app.post('/api/admin/courses', (req, res) => {
  const { password } = req.body;

  if (!verifyAdmin(password)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const data = readCourses();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Create a new course (admin only)
app.post('/api/admin/courses/create', (req, res) => {
  const { password, course } = req.body;

  if (!verifyAdmin(password)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const data = readCourses();
    const newCourse = {
      id: Date.now().toString(),
      title: course.title,
      description: course.description,
      lessons: course.lessons || []
    };
    data.courses.push(newCourse);

    if (writeCourses(data)) {
      res.json({ success: true, course: newCourse });
    } else {
      res.status(500).json({ error: 'Failed to save course' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// Update a course (admin only)
app.post('/api/admin/courses/update', (req, res) => {
  const { password, courseId, course } = req.body;

  if (!verifyAdmin(password)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const data = readCourses();
    const courseIndex = data.courses.findIndex(c => c.id === courseId);

    if (courseIndex === -1) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Preserve existing lessons when updating course details
    const existingLessons = data.courses[courseIndex].lessons || [];

    data.courses[courseIndex] = {
      ...data.courses[courseIndex],
      title: course.title,
      description: course.description,
      lessons: existingLessons, // Always preserve existing lessons
      id: courseId // Preserve the original ID
    };

    if (writeCourses(data)) {
      res.json({ success: true, course: data.courses[courseIndex] });
    } else {
      res.status(500).json({ error: 'Failed to update course' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// Delete a course (admin only)
app.post('/api/admin/courses/delete', (req, res) => {
  const { password, courseId } = req.body;

  if (!verifyAdmin(password)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const data = readCourses();
    data.courses = data.courses.filter(c => c.id !== courseId);

    if (writeCourses(data)) {
      res.json({ success: true });
    } else {
      res.status(500).json({ error: 'Failed to delete course' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

// Create a new lesson (admin only)
app.post('/api/admin/lessons/create', (req, res) => {
  const { password, courseId, lesson } = req.body;

  if (!verifyAdmin(password)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const data = readCourses();
    const course = data.courses.find(c => c.id === courseId);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const newLesson = {
      id: Date.now().toString(),
      title: lesson.title,
      description: lesson.description,
      duration: lesson.duration,
      fbUrl: lesson.fbUrl,
      order: lesson.order || course.lessons.length + 1
    };

    course.lessons.push(newLesson);

    if (writeCourses(data)) {
      res.json({ success: true, lesson: newLesson });
    } else {
      res.status(500).json({ error: 'Failed to save lesson' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to create lesson' });
  }
});

// Update a lesson (admin only)
app.post('/api/admin/lessons/update', (req, res) => {
  const { password, courseId, lessonId, lesson } = req.body;

  if (!verifyAdmin(password)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const data = readCourses();
    const course = data.courses.find(c => c.id === courseId);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const lessonIndex = course.lessons.findIndex(l => l.id === lessonId);

    if (lessonIndex === -1) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    course.lessons[lessonIndex] = {
      ...course.lessons[lessonIndex],
      ...lesson,
      id: lessonId // Preserve the original ID
    };

    if (writeCourses(data)) {
      res.json({ success: true, lesson: course.lessons[lessonIndex] });
    } else {
      res.status(500).json({ error: 'Failed to update lesson' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update lesson' });
  }
});

// Delete a lesson (admin only)
app.post('/api/admin/lessons/delete', (req, res) => {
  const { password, courseId, lessonId } = req.body;

  if (!verifyAdmin(password)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const data = readCourses();
    const course = data.courses.find(c => c.id === courseId);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    course.lessons = course.lessons.filter(l => l.id !== lessonId);

    if (writeCourses(data)) {
      res.json({ success: true });
    } else {
      res.status(500).json({ error: 'Failed to delete lesson' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete lesson' });
  }
});

// Get lesson redirect URL (no auth required, but URL is sent for immediate redirect)
app.get('/api/lesson/:lessonId/redirect', (req, res) => {
  const { lessonId } = req.params;

  try {
    const data = readCourses();
    let foundLesson = null;

    for (const course of data.courses) {
      const lesson = course.lessons.find(l => l.id === lessonId);
      if (lesson) {
        foundLesson = lesson;
        break;
      }
    }

    if (!foundLesson || !foundLesson.fbUrl) {
      return res.status(404).json({ error: 'Lesson not found or no video available' });
    }

    // Return the URL for client-side redirect
    res.json({ redirectUrl: foundLesson.fbUrl });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lesson' });
  }
});

// ==================== CHALLENGE ENDPOINTS ====================

// Get active challenge (public)
app.get('/api/challenge', (req, res) => {
  try {
    const data = readChallenge();

    if (!data.challenge) {
      return res.json({ challenge: null });
    }

    // Return challenge without sensitive data
    res.json({ challenge: data.challenge });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch challenge' });
  }
});

// Get challenge (admin only)
app.post('/api/admin/challenge', (req, res) => {
  const { password } = req.body;

  if (!verifyAdmin(password)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const data = readChallenge();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch challenge' });
  }
});

// Create or update challenge (admin only)
app.post('/api/admin/challenge/save', (req, res) => {
  const { password, challenge } = req.body;

  if (!verifyAdmin(password)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const newChallenge = challenge ? {
      id: challenge.id || Date.now().toString(),
      title: challenge.title,
      description: challenge.description,
      duration: challenge.duration,
      days: challenge.days || []
    } : null;

    const data = { challenge: newChallenge };

    if (writeChallenge(data)) {
      res.json({ success: true, challenge: newChallenge });
    } else {
      res.status(500).json({ error: 'Failed to save challenge' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to save challenge' });
  }
});

// Delete challenge (admin only)
app.post('/api/admin/challenge/delete', (req, res) => {
  const { password } = req.body;

  if (!verifyAdmin(password)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const data = { challenge: null };

    if (writeChallenge(data)) {
      res.json({ success: true });
    } else {
      res.status(500).json({ error: 'Failed to delete challenge' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete challenge' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
