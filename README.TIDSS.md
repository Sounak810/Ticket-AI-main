# 🎫 Ticket AI - Intelligent Support Ticket Management System

A modern, full-stack ticket management system powered by AI for intelligent ticket triage, automated assignment, and streamlined workflow management.

## ✨ Features

### 🤖 AI-Powered Ticket Analysis
- **Automatic Priority Detection**: AI analyzes tickets and assigns priority levels (Low, Medium, High)
- **Smart Skill Matching**: Identifies required technical skills for each ticket
- **Intelligent Assignment**: Automatically assigns tickets to moderators with matching skills
- **Helpful Notes Generation**: Provides detailed analysis and helpful resources for resolution

### 👥 User Management & Roles
- **Multi-Role System**: User, Moderator, and Admin roles with different permissions
- **Skill-Based Matching**: Users can have skills for intelligent ticket assignment
- **Admin Panel**: Comprehensive user management with role and skill editing

### 📧 Automated Notifications
- **Welcome Emails**: Automated welcome messages for new users
- **Assignment Notifications**: Email alerts when tickets are assigned to moderators
- **Background Processing**: Uses Inngest for reliable background job processing

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Real-time Updates**: Dynamic ticket status updates
- **Markdown Support**: Rich text formatting in ticket notes
- **Intuitive Navigation**: Clean, modern interface built with React and Tailwind CSS

## 🏗️ Architecture

### Frontend
- **React 19** with modern hooks and components
- **Tailwind CSS 4** for responsive styling
- **DaisyUI** for consistent UI components
- **React Router** for client-side routing
- **React Markdown** for rich text rendering

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT Authentication** for secure user sessions
- **bcrypt** for password hashing
- **CORS** enabled for cross-origin requests

### AI & Automation
- **Google Gemini AI** for intelligent ticket analysis
- **Inngest** for background job processing
- **Nodemailer** for email notifications
- **Mailtrap** for email testing

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB instance
- Google AI API key (Gemini)
- Mailtrap account for email testing

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Ticket-AI
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**

   **Server (.env)**
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   GEMINI_API_KEY=your_google_ai_api_key
   JWT_SECRET=your_jwt_secret_key
   CORS_ORIGINS=http://localhost:5173
   INNGEST_EVENT_KEY=your_inngest_event_key
   INNGEST_SIGNING_KEY=your_inngest_signing_key
   
   # Mailtrap SMTP Configuration
   MAILTRAP_SMTP_HOST=sandbox.smtp.mailtrap.io
   MAILTRAP_SMTP_PORT=2525
   MAILTRAP_SMTP_USER=your_mailtrap_user
   MAILTRAP_SMTP_PASS=your_mailtrap_password
   ```

   **Client (.env)**
   ```env
   VITE_SERVER_URL=http://localhost:3000
   ```

   You can also copy the provided examples:
   - `server/.env.example` → `server/.env`
   - `client/.env.example` → `client/.env`

4. **Start the application**

   **Terminal 1 - Start the server:**
   ```bash
   cd server
   npm run dev
   ```

   **Terminal 2 - Start the client:**
   ```bash
   cd client
   npm run dev
   ```

   **Terminal 3 - Start Inngest (for background jobs):**
   ```bash
   cd server
   npm run inngest-dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - Inngest Dev Server: http://localhost:8288

## 📁 Project Structure

```
Ai_agent/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   │   ├── check-auth.jsx
│   │   │   └── navbar.jsx
│   │   ├── page/          # Page components
│   │   │   ├── admin.jsx
│   │   │   ├── login.jsx
│   │   │   ├── signup.jsx
│   │   │   ├── ticket.jsx
│   │   │   └── tickets.jsx
│   │   ├── assets/        # Static assets
│   │   ├── index.css      # Global styles
│   │   └── main.jsx       # App entry point
│   ├── package.json
│   └── vite.config.js
├── server/                # Node.js backend application
│   ├── controllers/       # Route handlers
│   │   ├── ticket.controller.js
│   │   └── user.controller.js
│   ├── middleware/        # Custom middleware
│   │   └── auth.js
│   ├── models/           # Database models
│   │   ├── ticket.model.js
│   │   └── user.models.js
│   ├── routes/           # API routes
│   │   ├── ticket.routes.js
│   │   └── user.routes.js
│   ├── inngest/          # Background job functions
│   │   ├── client.js
│   │   └── functions/
│   │       ├── on-ticket-create.js
│   │       └── OnSignup.js
│   ├── utils/            # Utility functions
│   │   ├── api.js        # AI integration
│   │   └── mailer.js     # Email utilities
│   ├── index.js          # Server entry point
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/users/signup` - User registration
- `POST /api/users/login` - User login
- `POST /api/users/logout` - User logout

### User Management
- `GET /api/users/user` - Get current user info
- `POST /api/users/update-user` - Update user (Admin only)

### Tickets
- `GET /api/tickets` - Get all tickets (filtered by role)
- `GET /api/tickets/:id` - Get specific ticket
- `POST /api/tickets` - Create new ticket

### Background Jobs
- `POST /api/inngest` - Inngest webhook endpoint

## 🔐 User Roles & Permissions

### User
- Create and view their own tickets
- Update personal profile

### Moderator
- View all tickets
- Access detailed ticket information including AI analysis
- Receive ticket assignments based on skills

### Admin
- Full system access
- User management capabilities
- Role and skill assignment
- View all tickets and users

## 🤖 AI Integration

The system uses Google's Gemini AI to automatically analyze tickets and provide:

- **Priority Assessment**: Automatically categorizes tickets as Low, Medium, or High priority
- **Skill Identification**: Determines required technical skills for resolution
- **Solution Guidance**: Provides helpful notes and potential solutions
- **Resource Links**: Suggests relevant documentation and resources

## 📧 Email Automation

Automated email notifications for:
- **Welcome emails** for new user registrations
- **Assignment notifications** when tickets are assigned to moderators
- **Status updates** for ticket progress (configurable)

## 🛠️ Development

### Available Scripts

**Server:**
- `npm run dev` - Start development server with nodemon
- `npm run inngest-dev` - Start Inngest development server

**Client:**
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Database Schema

**User Model:**
```javascript
{
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ["user", "moderator", "admin"]),
  skills: [String],
  createdAt: Date
}
```

**Ticket Model:**
```javascript
{
  title: String,
  description: String,
  status: String (default: "TODO"),
  createdBy: ObjectId (ref: User),
  assignedTo: ObjectId (ref: User),
  priority: String,
  deadline: Date,
  helpfulNotes: String,
  relatedSkills: [String],
  createdAt: Date
}
```

## 🚀 Deployment

### Production Environment Setup

1. **Environment Variables**: Update production URLs and API keys
2. **Database**: Configure production MongoDB instance
3. **Email Service**: Set up production email service (replace Mailtrap)
4. **Build**: Run `npm run build` in client directory
5. **Server**: Deploy server with PM2 or similar process manager

### Recommended Hosting
- **Frontend**: Vercel, Netlify, or similar static hosting
- **Backend**: Railway, Render, or AWS EC2
- **Database**: MongoDB Atlas
- **Email**: SendGrid, AWS SES, or similar production email service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Created by [Sounak Shyamal](https://github.com/sounak810)

---

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/sounak810/ticket-ai/issues) section
2. Create a new issue with detailed information
3. Contact the maintainer

---

⭐ **Star this repository if you find it helpful!**
