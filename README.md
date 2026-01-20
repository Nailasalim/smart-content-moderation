# Smart Content Moderation & Reporting Platform

A comprehensive content moderation system that combines AI-powered detection with human moderation. Users can post content, report inappropriate posts, and moderators can review and take action on flagged content.

## Features

### User Features
- **Post Content**: Share posts with the community
- **View Community Posts**: Browse approved community content
- **Report Content**: Report inappropriate or violating content
- **Track Reports**: View status of your submitted reports (Pending/Reviewed)
- **See Moderator Actions**: View final decisions on your reports (Approved/Removed/Warned)

### Moderator Features
- **AI Reports Dashboard**: Review content flagged by AI moderation
- **User Reports Dashboard**: Review content reported by users
- **Moderation Actions**: 
  - Approve content
  - Remove content
  - Warn content creators
- **Action History**: View complete moderation history for any content
- **Your Actions**: Track all moderation actions you've performed with filtering (All/Approved/Removed/Warned)

### AI Moderation
- **Automatic Content Analysis**: AI automatically flags potentially inappropriate content
- **Retry Logic**: Robust retry mechanism for AI API calls (up to 3 attempts)
- **Fallback System**: Content sent for manual review if AI fails

## Tech Stack

### Frontend
- **React 19** - UI library
- **React Router DOM** - Client-side routing
- **Vite** - Build tool and dev server
- **Axios** - HTTP client for API calls
- **Context API** - State management for authentication

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **Prisma** - ORM for database management
- **PostgreSQL** - Database
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Google Generative AI** - AI content moderation

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Google Generative AI API key (for AI moderation)
- npm or yarn package manager

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nailasalim/smart-content-moderation.git
   cd smart-content-moderation
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Set up environment variables**

   Create a `.env` file in the `backend` directory:
   ```env
   DATABASE_URL="your_postgresql_connection_string"
   JWT_SECRET="your_jwt_secret_key"
   PORT=5000
   GOOGLE_AI_API_KEY="your_google_generative_ai_api_key"
   ```

5. **Set up the database**
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma generate
   ```

## Running the Application

### Development Mode

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

### Production Build

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Start the backend in production mode**
   ```bash
   cd backend
   node src/index.js
   ```

## Project Structure

```
smart-content-moderation/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema
│   │   └── migrations/            # Database migrations
│   └── src/
│       ├── controllers/          # Request handlers
│       │   ├── auth.controller.js
│       │   ├── content.controller.js
│       │   ├── moderation.controller.js
│       │   └── report.controller.js
│       ├── middleware/            # Custom middleware
│       │   ├── auth.middleware.js
│       │   ├── role.middleware.js
│       │   └── moderator.middleware.js
│       ├── routes/                # API routes
│       │   ├── auth.routes.js
│       │   ├── content.routes.js
│       │   ├── moderation.routes.js
│       │   └── report.routes.js
│       ├── utils/                 # Utility functions
│       │   ├── aiModeration.js    # AI moderation logic
│       │   └── prismaClient.js    # Prisma client instance
│       └── index.js               # Entry point
│
├── frontend/
│   └── src/
│       ├── api/                   # API service functions
│       ├── auth/                  # Authentication components
│       ├── components/            # Reusable components
│       │   ├── moderator/         # Moderator-specific components
│       │   └── Navbar.jsx
│       ├── context/               # React context providers
│       ├── pages/                 # Page components
│       │   ├── moderator/        # Moderator pages
│       │   └── user/              # User pages
│       └── App.jsx                # Main app component
│
└── README.md
```

## Authentication & Authorization

- **JWT-based authentication** for secure user sessions
- **Role-based access control** (User/Moderator)
- **Protected routes** for authenticated users
- **Moderator-only routes** for admin functions

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile

### Content
- `POST /api/content` - Submit new content
- `GET /api/content/community` - Get approved community content
- `GET /api/content/flagged` - Get AI-flagged content (Moderator only)
- `GET /api/content/:id` - Get content by ID

### Reports
- `POST /api/report` - Report content
- `GET /api/report/my-reports` - Get user's own reports
- `GET /api/report` - Get all reports (Moderator only)

### Moderation
- `POST /api/moderation/action` - Take moderation action (Moderator only)
- `GET /api/moderation/my-actions` - Get moderator's own actions
- `GET /api/moderation/history/:contentId` - Get content moderation history

## Database Schema

### Models
- **User**: User accounts with role (USER/MODERATOR)
- **Content**: User-submitted content with status tracking
- **Report**: User reports on content
- **ModerationAction**: Records of moderator actions

### Content Status Flow
- `PENDING` → User-reported content awaiting review
- `FLAGGED` → AI-flagged content
- `APPROVED` → Content approved for community
- `REMOVED` → Content removed by moderator
- `WARNED` → Content warned but kept visible

## Key Features Explained

### AI Moderation
- Uses Google Generative AI to analyze content
- Automatically flags potentially inappropriate content
- Includes retry logic (3 attempts) for reliability
- Falls back to manual review if AI fails

### Report System
- Users can report content with reasons
- Reports are tracked with status (PENDING/REVIEWED)
- Moderators see final actions on reports
- Users can view their report history

### Moderator Dashboard
- **AI Reports**: Content flagged by AI
- **User Reports**: Content reported by users
- **Your Actions**: Personal moderation history with filtering

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based access control
- Protected API endpoints
- Input validation and sanitization

## Development

### Database Migrations
```bash
cd backend
npx prisma migrate dev --name migration_name
npx prisma generate
```

### View Database
```bash
cd backend
npx prisma studio
```

## Environment Variables

### Backend (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
JWT_SECRET="your-secret-key-here"
PORT=5000
GOOGLE_AI_API_KEY="your-google-ai-api-key"
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Author

**Naila Salim**
- GitHub: [@Nailasalim](https://github.com/Nailasalim)

## Acknowledgments

- Google Generative AI for content moderation capabilities
- React and Express communities for excellent documentation
- Prisma for the amazing ORM

---

**Note**: Make sure to set up your environment variables and database before running the application. The AI moderation feature requires a valid Google Generative AI API key.
