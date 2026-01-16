# 🌙 SleepWell - Sleep Education Platform

A lightweight, educational web project designed to teach people how to improve their sleep quality. Built with simplicity and cost-efficiency in mind.

## 🎯 Project Overview

This platform presents structured sleep education courses while hosting video content externally in a private Facebook group (due to budget constraints). The website guides users through courses and redirects them to Facebook-hosted lesson videos without publicly exposing URLs.

## ✨ Features

- **Dark Night Theme**: Beautiful starry night sky background representing quality sleep
- **Course Management**: Structured courses with multiple lessons
- **Admin Panel**: Easy-to-use interface for managing courses and lessons
- **Secure Access**: Password-protected admin area
- **Facebook Integration**: Seamless redirect to private Facebook group videos
- **Static Hosting Ready**: Optimized for DigitalOcean static page hosting
- **JSON-Based Storage**: No database required - lightweight and simple

## 📁 Project Structure

```
sleep/
├── backend/              # Node.js backend server
│   ├── server.js        # Express server with API endpoints
│   ├── package.json     # Backend dependencies
│   ├── .env            # Environment variables (not committed)
│   └── .env.example    # Environment template
├── public/              # Static frontend files
│   ├── index.html      # Main landing page
│   └── admin.html      # Admin dashboard
├── data/                # JSON data storage
│   └── courses.json    # Courses and lessons data
└── README.md           # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sleep
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # Copy the example env file
   cp .env.example .env

   # Edit .env and set your admin password
   nano .env
   ```

4. **Start the backend server**
   ```bash
   npm start
   ```

   The server will run on `http://localhost:3000`

5. **Access the website**
   - Main site: `http://localhost:3000`
   - Admin panel: `http://localhost:3000/admin`
   - Default admin password: `admin123` (change this!)

## 🔧 Configuration

### Backend URL Configuration

When deploying to production, update the `ROOT` variable in both HTML files:

**In `public/index.html` and `public/admin.html`:**
```javascript
const ROOT = 'https://your-backend-server.com';
```

### Admin Password

Update the admin password in `backend/.env`:
```env
ADMIN_PASSWORD=your_secure_password_here
```

## 📝 Using the Admin Panel

1. **Login**
   - Navigate to `/admin`
   - Enter your admin password from `.env`

2. **Create a Course**
   - Click "Create New Course"
   - Enter course title and description
   - Click "Save Course"

3. **Add Lessons**
   - Click "Add Lesson" under a course
   - Fill in lesson details:
     - Title
     - Description
     - Duration (e.g., "15 min")
     - Facebook Video URL
     - Order (lesson number)
   - Click "Save Lesson"

4. **Edit/Delete**
   - Use the Edit and Delete buttons next to each course/lesson
   - Changes are saved immediately to `data/courses.json`

## 🌐 Deployment

### Backend (Any Node.js Hosting)

1. Deploy to your preferred Node.js hosting (Heroku, Railway, Render, etc.)
2. Set environment variables (PORT, ADMIN_PASSWORD)
3. Ensure `data/` directory is writable

### Frontend (DigitalOcean Static Hosting)

1. Copy contents of `public/` folder
2. Update `ROOT` variable in both HTML files to point to your backend
3. Upload to DigitalOcean static hosting

### Important Notes

- Backend and frontend can be hosted on different servers
- Ensure CORS is properly configured (already set up in server.js)
- Keep your admin password secure
- Facebook video URLs should point to your private group posts

## 🔒 Security

- Admin password stored in `.env` (never commit this file)
- Facebook URLs never exposed on public pages
- Simple password authentication (suitable for MVP)
- Consider adding JWT or session management for production

## 🎨 Customization

### Theme Colors

Tailwind CSS is used for all styling. No custom CSS needed. The dark theme uses:
- Background: Gradient from `#0a0e27` to `#2d1b4e`
- Accent: Purple gradient (`from-purple-600 to-indigo-600`)

### Adding More Sections

Edit `public/index.html` to add more sections to the landing page. Follow the existing structure and use Tailwind classes.

## 📊 Data Structure

Courses are stored in `data/courses.json`:

```json
{
  "courses": [
    {
      "id": "1",
      "title": "Sleep Fundamentals",
      "description": "Course description",
      "lessons": [
        {
          "id": "101",
          "title": "Lesson title",
          "description": "Lesson description",
          "duration": "15 min",
          "fbUrl": "https://www.facebook.com/groups/...",
          "order": 1
        }
      ]
    }
  ]
}
```

## 🛠️ API Endpoints

### Public Endpoints
- `GET /api/courses` - Get all courses (without Facebook URLs)
- `GET /api/lesson/:lessonId/redirect` - Get lesson redirect URL

### Admin Endpoints (require password)
- `POST /api/admin/login` - Admin login
- `POST /api/admin/courses` - Get all courses (with URLs)
- `POST /api/admin/courses/create` - Create new course
- `POST /api/admin/courses/update` - Update course
- `POST /api/admin/courses/delete` - Delete course
- `POST /api/admin/lessons/create` - Create lesson
- `POST /api/admin/lessons/update` - Update lesson
- `POST /api/admin/lessons/delete` - Delete lesson

## 🚀 Future Enhancements

When budget allows, consider:
- Self-hosted video solution
- User authentication system
- Progress tracking
- Certificates of completion
- Discussion forums
- Email notifications
- Analytics dashboard

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## 📧 Support

For questions or support, please open an issue in the repository.

---

**Built with 💜 for better sleep**