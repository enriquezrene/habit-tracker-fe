# Forge - Habit Tracking App

A modern, intuitive habit tracking application built with React and Firebase. Forge helps users build and maintain positive habits through a clean interface, daily tracking, and motivational features.

## 🎯 Business Concept

Forge is a personal productivity tool designed to help users:
- **Build Consistent Habits**: Track daily activities and build lasting routines
- **Stay Motivated**: Receive positive reinforcement through celebration animations and motivational quotes
- **Monitor Progress**: Visualize completion statistics and daily streaks
- **Maintain Focus**: Clean, distraction-free interface with optional notifications

### Key Features
- ✅ Daily habit tracking with visual feedback
- 📊 Progress statistics and completion analytics
- 🎉 Celebration animations for habit completion
- 🌅 Daily stoic quotes for motivation
- 📱 Responsive design for mobile and desktop
- 🔔 Browser notifications for habit reminders
- 🌙 Dark/light theme support
- 👤 User authentication with Google sign-in

## 🛠 Technical Overview

### Tech Stack
- **Frontend**: React 19 with Vite for fast development
- **Styling**: Tailwind CSS 4.0 with dark mode support
- **Authentication**: Firebase Auth (email/password + Google OAuth)
- **Database**: Firestore for real-time data synchronization
- **Animations**: Framer Motion for smooth transitions
- **Icons**: Lucide React for consistent iconography
- **Notifications**: Browser notification API
- **Date Handling**: date-fns for robust date manipulation

### Architecture
```
src/
├── components/          # Reusable UI components
│   ├── ui/            # Base UI primitives (Button, Input, etc.)
│   ├── auth/          # Authentication-related components
│   ├── habits/        # Habit tracking components
│   └── layout/        # Layout and navigation components
├── contexts/          # React contexts for global state
├── lib/               # Utility functions and Firebase services
├── pages/             # Main application pages
└── assets/            # Static assets
```

### Data Model
- **Habits**: User-created habits with title, description, and metadata
- **Completions**: Daily completion records linked to habits and dates
- **User Settings**: Preferences for notifications, themes, and app behavior

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project (for backend services)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd habit-tracker-fe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a new Firebase project at https://console.firebase.google.com
   - Enable Authentication (Email/Password and Google providers)
   - Create a Firestore database
   - Copy your Firebase configuration

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Update `.env` with your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## 📋 Available Commands

### Development
```bash
npm run dev          # Start development server with hot reload
npm run lint         # Run ESLint for code quality checks
```

### Production
```bash
npm run build        # Build for production
npm run preview      # Preview production build locally
```

### Testing (if added)
```bash
npm test            # Run test suite
npm run test:watch  # Run tests in watch mode
```

## 🔧 Development Workflow

### Code Style
- Uses ESLint with React hooks and refresh plugins
- Tailwind CSS for styling with consistent design tokens
- Component-based architecture with clear separation of concerns

### Key Patterns
- **Context API**: Global state management for auth and theme
- **Custom Hooks**: Encapsulated logic for data fetching and state
- **Firebase Integration**: Direct SDK usage with proper error handling
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

### File Structure Best Practices
- Components in `/components` grouped by feature
- Pages in `/pages` for route-level components
- Utilities and services in `/lib`
- Each component exports a single default function

## 🌟 Key Components

### Authentication
- **LoginPage.jsx**: Combined login/signup with form validation
- **AuthContext.jsx**: Global auth state management
- **ProtectedRoute.jsx**: Route protection for authenticated users

### Habit Management
- **DashboardPage.jsx**: Main habit tracking interface
- **HabitItem.jsx**: Individual habit display and interaction
- **CreateHabitModal.jsx**: Habit creation form
- **DateNavigator.jsx**: Date selection and navigation

### User Experience
- **OnboardingFlow.jsx**: First-time user guidance
- **CelebrationOverlay.jsx**: Completion celebration animations
- **DailyStats.jsx**: Progress visualization
- **ThemeProvider.jsx**: Dark/light theme management

## 🔐 Firebase Configuration

### Required Firebase Services
1. **Authentication**: 
   - Email/Password provider
   - Google OAuth provider
2. **Firestore Database**: 
   - Rules configured for user data isolation
   - Collections: `habits`, `completions`, `userSettings`
3. **Storage** (optional): For profile images or attachments

### Firestore Security Rules
Users should only be able to access their own data. Configure rules accordingly in your Firebase console.

## 📱 Features in Detail

### Habit Tracking
- Create custom habits with titles and descriptions
- Daily completion tracking with visual feedback
- Historical data viewing with date navigation
- Habit deletion and management

### Progress Visualization
- Daily completion statistics
- Weekly/monthly progress views
- Streak tracking and consistency metrics
- Visual indicators for completed habits

### User Experience
- Smooth animations and transitions
- Responsive design for all screen sizes
- Offline capability considerations
- Accessibility-focused component design

## 🚀 Deployment

### Production Build
```bash
npm run build
```
This creates an optimized production build in the `dist/` folder.

### Hosting Options
- **Firebase Hosting**: Recommended for seamless integration
- **Vercel/Netlify**: Static hosting with CI/CD
- **Custom hosting**: Any static hosting service

### Environment Variables
Ensure all Firebase configuration variables are set in your production environment.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔮 Future Enhancements

- [ ] Habit categories and tags
- [ ] Advanced analytics and insights
- [ ] Social features and sharing
- [ ] Mobile app (React Native)
- [ ] Habit templates and suggestions
- [ ] Integration with calendar apps
- [ ] Data export functionality

## 🐛 Troubleshooting

### Common Issues
- **Firebase connection errors**: Verify configuration in `.env`
- **Build errors**: Check Node.js version compatibility
- **Authentication issues**: Ensure Firebase Auth providers are enabled
- **Firestore permissions**: Review security rules configuration

### Getting Help
- Check the Firebase documentation for specific service issues
- Review browser console for detailed error messages
- Ensure all environment variables are properly configured
