# GlobeTrotter - Travel Planning Application

A full-stack travel planning application with user authentication, email verification, and a beautiful modern UI. Built with React, Node.js, MongoDB, and SendGrid.

## 🌟 Features

### Authentication & Security
- ✅ User registration with email verification
- ✅ Secure login/logout functionality
- ✅ Password reset via email
- ✅ JWT token-based authentication
- ✅ Protected routes
- ✅ Input validation and sanitization

### User Experience
- ✅ Beautiful, responsive design with Tailwind CSS
- ✅ Modern UI with smooth animations
- ✅ Form validation with React Hook Form
- ✅ Toast notifications for user feedback
- ✅ Loading states and error handling

### Backend Features
- ✅ RESTful API with Express.js
- ✅ MongoDB Atlas integration
- ✅ SendGrid email service
- ✅ Cloudinary for media storage
- ✅ Rate limiting and security headers
- ✅ Comprehensive error handling

## 🏗️ Project Structure

```
GlobeTrotter/
├── backend/                 # Backend API
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   ├── config.env          # Environment variables
│   ├── package.json        # Backend dependencies
│   └── server.js           # Main server file
├── frontend/               # React frontend
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── App.js          # Main app component
│   │   └── index.js        # Entry point
│   ├── package.json        # Frontend dependencies
│   └── tailwind.config.js  # Tailwind configuration
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account
- SendGrid account
- Cloudinary account

### 1. Clone the Repository
```bash
git clone <repository-url>
cd GlobeTrotter
```

### 2. Install All Dependencies
```bash
# Install root dependencies (including concurrently)
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

**Or use the single command:**
```bash
npm run install-all
```

### 3. Environment Configuration
Create a `config.env` file in the backend directory with your credentials:

1. Copy the example file:
```bash
cd backend
cp config.env.example config.env
```

2. Update the `config.env` file with your actual credentials:
```env
MONGODB_URI=your_mongodb_atlas_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=your_verified_sendgrid_email
CLIENT_URL=http://localhost:3000
```

**⚠️ Important:** Never commit your `config.env` file to version control. It's already added to `.gitignore` to prevent accidental commits.

### 4. Frontend Setup
*Frontend dependencies are already installed in step 2. If you need to reinstall:*
```bash
cd frontend
npm install
```

### 5. Start the Application

**Option 1: Run Both Servers with Single Command (Recommended)**
```bash
# Install concurrently (if not already installed)
npm install

# Run both frontend and backend simultaneously
npm run dev
```

**Option 2: Run Servers Separately**
**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📜 Available Scripts

### Root Level Scripts
```bash
npm run dev          # Run both frontend and backend simultaneously
npm run server       # Run only the backend server
npm run client       # Run only the frontend development server
npm run install-all  # Install dependencies for all packages
npm run build        # Build the frontend for production
npm start            # Start the backend in production mode
```

### Backend Scripts
```bash
cd backend
npm run dev          # Start backend in development mode with nodemon
npm start            # Start backend in production mode
```

### Frontend Scripts
```bash
cd frontend
npm start            # Start frontend development server
npm run build        # Build for production
npm test             # Run tests
```

## 📧 Email Configuration

### SendGrid Setup
1. Create a SendGrid account
2. Verify your sender email address
3. Generate an API key
4. Update the `SENDGRID_API_KEY` and `EMAIL_FROM` in your config.env

### Email Templates
The application includes beautiful HTML email templates for:
- Email verification
- Password reset
- Welcome emails

## 🔐 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Tokens**: Secure authentication tokens
- **Rate Limiting**: API request throttling
- **Input Validation**: Express-validator middleware
- **CORS**: Configured for security
- **Helmet**: Security headers
- **Environment Variables**: Sensitive data protection

## 🎨 UI/UX Features

- **Responsive Design**: Works on all devices
- **Modern UI**: Clean, professional design
- **Smooth Animations**: CSS transitions and animations
- **Form Validation**: Real-time validation feedback
- **Loading States**: User-friendly loading indicators
- **Toast Notifications**: Success/error feedback
- **Accessibility**: ARIA labels and keyboard navigation

## 📱 Pages & Routes

### Public Pages
- `/` - Landing page with features and CTA
- `/signup` - User registration
- `/login` - User authentication
- `/verify-email` - Email verification page
- `/forgot-password` - Password reset request
- `/reset-password` - Password reset form

### Protected Pages
- `/dashboard` - User dashboard (requires authentication)

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify-email/:token` - Email verification
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Password reset
- `POST /api/auth/resend-verification` - Resend verification email

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `PUT /api/user/change-password` - Change password
- `DELETE /api/user/account` - Delete account
- `POST /api/user/logout` - User logout

## 🛠️ Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **SendGrid** - Email service
- **Cloudinary** - Media storage
- **Express-validator** - Input validation
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **React Hook Form** - Form management
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **React Hot Toast** - Toast notifications

## 🚀 Deployment

### Backend Deployment (Heroku)
1. Create a Heroku app
2. Set environment variables in Heroku dashboard
3. Deploy using Git:
```bash
git push heroku main
```

### Frontend Deployment (Vercel/Netlify)
1. Build the frontend:
```bash
cd frontend
npm run build
```
2. Deploy the `build` folder to your preferred platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

## 🎯 Roadmap

- [ ] Trip planning interface
- [ ] Budget tracking features
- [ ] Social sharing capabilities
- [ ] Mobile app development
- [ ] Advanced analytics
- [ ] Multi-language support

---

**Happy Traveling! 🌍✈️**
