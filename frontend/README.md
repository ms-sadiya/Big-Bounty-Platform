# Bug Bounty Platform - Frontend

A modern React-based frontend for a comprehensive Bug Bounty Platform where users can post bugs, submit solutions, and earn rewards.

## 🌟 Features

### User Management
- User registration and login with secure authentication
- User profiles with statistics and earned rewards
- Leaderboard to showcase top contributors

### Bug Management
- Post bugs with title, description, and bounty amount
- View all bugs with filtering and search
- Bug status tracking (Open, In Review, Closed)
- Category-based organization (Security, Performance, UI/UX, etc.)

### Submission System
- Submit solutions with proof/evidence
- Multiple submissions per bug
- Solution status tracking (Pending, Approved, Rejected)
- Detailed submission reviews and ratings

### Dashboard
- Personal workspace for users
- View created bugs and their status
- Track submitted solutions
- Monitor earned rewards
- Statistics overview (bugs posted, solutions submitted, wins)

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will open at `http://localhost:5173` by default.

## 📋 Environment Setup

### Backend API Configuration

Update the base URL in `src/api/axiosConfig.js`:

```javascript
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Update with your backend URL
});
```

## 📁 Project Structure

See [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) for detailed folder organization.

```
src/
├── api/           - API integration endpoints
├── components/    - Reusable UI components
├── context/       - React context for state management
├── hooks/         - Custom React hooks
├── pages/         - Page-level components
├── styles/        - CSS stylesheets
├── utils/         - Utility functions
├── App.jsx        - Main application component
└── main.jsx       - React entry point
```

## 🔐 Authentication

The application uses JWT-based authentication with localStorage:

1. User registers/logs in
2. Backend returns JWT token
3. Token stored in localStorage
4. Token automatically included in API requests via axios interceptors
5. Token validated on each protected route

### Protected Routes
- `/create-bug` - Create new bug (authenticated users only)
- `/dashboard` - User dashboard (authenticated users only)
- `/my-bugs` - View created bugs (authenticated users only)
- `/my-submissions` - View submitted solutions (authenticated users only)

## 🛠️ API Integration

### API Modules

**authAPI.js** - Authentication endpoints
```javascript
- register(userData)
- login(credentials)
- logout()
- updateProfile(userData)
- getCurrentUser()
```

**bugAPI.js** - Bug management endpoints
```javascript
- getAllBugs(filters)
- getBugById(bugId)
- createBug(bugData)
- updateBug(bugId, bugData)
- deleteBug(bugId)
- getUserBugs(userId)
```

**submissionAPI.js** - Submission endpoints
```javascript
- getBugSubmissions(bugId)
- createSubmission(bugId, submissionData)
- approveSubmission(submissionId)
- rejectSubmission(submissionId, reason)
- getUserSubmissions(userId)
```

**userAPI.js** - User profile endpoints
```javascript
- getUserProfile(userId)
- getUserStats(userId)
- getUserRewards(userId)
- getLeaderboard()
```

## 🎨 Styling

- **Theme**: Modern, professional design with purple/indigo primary color
- **Responsive**: Mobile-first approach, works seamlessly on all devices
- **CSS Variables**: Centralized color and spacing management in `App.css`
- **Components**: Modular CSS files per component

### Color Palette
- Primary: `#4f46e5` (Indigo)
- Secondary: `#10b981` (Green)
- Danger: `#ef4444` (Red)
- Success: `#10b981` (Green)

## 📦 Dependencies

```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^7.13.0",
  "axios": "^1.13.5"
}
```

## 🔧 Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run ESLint
npm run lint
```

## 📝 Form Validations

### Bug Creation
- Title: Required, 5-100 characters
- Description: Required, 20+ characters
- Bounty Amount: Required, must be > 0
- Category: Required

### User Registration
- Name: Required, 2+ characters
- Email: Valid email format
- Password: 6+ characters, uppercase, lowercase, number
- Confirm Password: Must match password

### Solution Submission
- Description: Required, 10+ characters
- Proof/Link: Required, valid URL

## 🌐 Pages Overview

**Home** - Landing page with platform overview and call-to-action

**Bug List** - Browse all bugs with filters
- Filter by status (Open, In Review, Closed)
- Filter by category
- Sort by newest, bounty, submissions
- Search functionality

**Bug Detail** - Single bug view
- Bug description and creator info
- List of all submissions
- Submit solution form (for logged-in users)
- Creator dashboard for approving/rejecting submissions

**Create Bug** - Form to post new bug
- Requires authentication
- Validation for all fields
- Success/error feedback

**User Profile** - View any user's profile
- User information and avatar
- Statistics (bugs created, submissions, wins, total earned)
- Rewards history

**Dashboard** - Personal user workspace
- Overview tab with quick stats
- My Bugs tab - View all created bugs
- My Submissions tab - View all submitted solutions
- Earning overview

**Login/Register** - Authentication pages
- Form validation
- Error handling
- Already have account / Create account links

## 🔄 Data Flow Example

### Creating a Bug

```
User fills form
    ↓
CreateBug.jsx validates input
    ↓
Calls bugAPI.createBug()
    ↓
axios sends POST to /api/bugs with auth token
    ↓
Backend creates bug
    ↓
Response returned with new bug ID
    ↓
Redirect to BugDetail page
    ↓
Show success message
```

### Submitting Solution

```
User clicks "Submit Solution"
    ↓
Form appears with description & proof fields
    ↓
User fills form
    ↓
BugDetail.jsx validates input
    ↓
Calls submissionAPI.createSubmission(bugId, data)
    ↓
axios sends POST to /api/submissions/bug/:bugId
    ↓
Backend creates submission
    ↓
Page refreshes to show new submission
    ↓
Show success message
```

## 🐛 Error Handling

The application includes comprehensive error handling:

1. **Form Validation** - Client-side validation before API calls
2. **API Interceptors** - Automatic error handling and token refresh
3. **User Feedback** - Alert components for success/error messages
4. **Unauthorized Access** - Auto-logout on 401 errors
5. **Network Errors** - User-friendly error messages

## 🔒 Security Features

- JWT token-based authentication
- Axios interceptors for automatic token injection
- Protected routes with ProtectedRoute component
- Client-side validation to prevent invalid submissions
- Secure password requirements
- CORS-compatible

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Environment Variables
Create a `.env` file for different environments:

```env
VITE_API_BASE_URL=https://api.example.com
```

Then update `axiosConfig.js`:
```javascript
baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
```

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [React Router Documentation](https://reactrouter.com)
- [Axios Documentation](https://axios-http.com)
- [Vite Documentation](https://vitejs.dev)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request
4. Follow code standards and naming conventions

## 📄 License

This project is licensed under the MIT License.

## ❓ FAQ

**Q: How do I change the backend API URL?**
A: Update the `baseURL` in `src/api/axiosConfig.js`

**Q: How do I add a new page?**
A: Create a new component in `src/pages/`, create corresponding route in `App.jsx`, and add CSS file in `src/styles/`

**Q: How do I modify the theme colors?**
A: Update the CSS variables in `src/App.css` under `:root`

**Q: How do I authenticate API requests?**
A: The token is automatically included via axios interceptors in `src/api/axiosConfig.js`

## 📞 Support

For issues or questions, please check the documentation or contact the development team.
