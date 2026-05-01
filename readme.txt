# Task Manager - Full Stack Application

A modern full-stack task management application with user authentication, task tracking, and project management built with React, Node.js/Express, and Docker.

## Tech Stack

### Frontend
- **React** - UI framework
- **Vite** - Build tool and dev server
- **JavaScript** - Component logic

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin requests
- **In-memory storage** - Demo data persistence

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy and static file server
- **Railway** - Cloud deployment

## Project Structure

```
task-manager/
├── backend/                    # Node.js Express API
│   ├── Dockerfile             # Backend container config
│   ├── package.json           # Backend dependencies
│   └── server.js              # Express server & API routes
│
├── frontend/                   # React application
│   ├── Dockerfile             # Frontend container config
│   ├── nginx.conf             # Nginx configuration
│   ├── package.json           # Frontend dependencies
│   ├── vite.config.js         # Vite configuration
│   ├── index.html             # Entry point
│   └── src/
│       ├── App.jsx            # Main app component
│       └── main.jsx           # React DOM entry
│
├── docker-compose.yml         # Multi-container setup
└── README.md                  # This file
```

## API Endpoints

### Authentication
- `POST /signup` - Create new user
  - Body: `{ name, email, password }`
  - Returns: `{ id, name, email }`

- `POST /login` - Authenticate user
  - Body: `{ email, password }`
  - Returns: `{ token }`

### Tasks (requires JWT token in Authorization header)
- `POST /tasks` - Create new task
  - Body: `{ title, time }`
  - Returns: `{ id, title, time, userId }`

- `GET /tasks` - Fetch user's tasks
  - Returns: Array of tasks

## Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Docker & Docker Compose (for containerized deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/HarshitSomvanshi2194/eth-task-manager.git
   cd task-manager
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

## Running Locally

### Option 1: Separate terminals

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

### Option 2: Docker Compose
```bash
docker-compose up
# Backend: http://localhost:5000
# Frontend: http://localhost:80
```

## Deployment on Railway

### Prerequisites
- Railway CLI installed (`npm install -g @railway/cli`)
- Railway account and logged in (`railway login`)
- GitHub repository pushed

### Deployment Steps

1. **Create a new Railway project**
   ```bash
   railway init --name "task-manager-prod"
   ```

2. **Add the backend service**
   - Go to Railway dashboard > Your project
   - Click "+ New" > "GitHub Repo"
   - Select your repository
   - Configure:
     - **Root Directory:** `backend`
     - **Port:** `5000`
     - Redeploy after configuration

3. **Add the frontend service**
   - Click "+ New" > "GitHub Repo"
   - Select your repository
   - Configure:
     - **Root Directory:** `frontend`
     - Click "Generate Domain" under Networking for public access

4. **Verify deployment**
   - Check service logs in Railway dashboard
   - Frontend should be accessible via generated Railway domain
   - Backend communicates via private networking at `backend.railway.internal:5000`

### Environment Variables
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - Database connection (optional, for production)

## Features

✅ User authentication (Signup/Login)
✅ Create and manage tasks
✅ Project organization
✅ JWT-based security
✅ Responsive UI
✅ Docker containerization
✅ Multi-container orchestration with Nginx
✅ Cloud-ready deployment

## Development Notes

- Backend uses in-memory storage for demo purposes
- Replace with MongoDB/PostgreSQL for production
- JWT secret is hardcoded for demo; use environment variables in production
- Password hashing via bcryptjs
- CORS enabled for frontend-backend communication

## Security Considerations for Production

1. **Replace in-memory storage** with a persistent database
2. **Use environment variables** for JWT secret
3. **Enable HTTPS** in production
4. **Add input validation** and sanitization
5. **Implement rate limiting**
6. **Use proper logging** instead of console.log
7. **Add database connection pooling**

## Troubleshooting

### Backend won't start
- Check port 5000 is available
- Verify `backend/package.json` dependencies are installed
- Check Node.js version is 18+

### Frontend can't connect to backend
- Ensure backend is running on localhost:5000
- Check CORS is enabled in Express
- Verify API endpoint in `frontend/src/App.jsx` points to correct server

### Docker containers won't build
- Ensure Dockerfiles exist in both `backend/` and `frontend/` directories
- Check docker-compose.yml syntax
- Run `docker-compose logs` for detailed error messages

### Railway deployment fails
- Verify GitHub repo is public or Railway has access
- **Check Root Directory settings** - must be `backend` for backend service, `frontend` for frontend service
- Review Railway deployment logs in dashboard
- Ensure both Dockerfiles are present

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Open a pull request

## License

MIT License - feel free to use this project for personal and commercial purposes.

## Support

For issues or questions, please open an issue in the GitHub repository.

---

**GitHub:** https://github.com/HarshitSomvanshi2194/eth-task-manager
