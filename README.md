# Alumni Connect

A comprehensive alumni networking platform built with Next.js, TypeScript, and Tailwind CSS. This application helps alumni and students connect, find mentors, attend events, and contribute to their alma mater.

## Features

### 🔐 Authentication & User Management
- **Login/Sign Up**: Email OTP and Social Login (Google, LinkedIn, GitHub)
- **Role Selection**: Alumni, Student, and Admin roles
- **Profile Verification**: Verification status badges for alumni

### 👥 Alumni Directory
- **Advanced Search**: Search by skills, company, graduation year, department
- **Smart Filters**: Filter chips for quick browsing (e.g., "CSE 2019", "AI Engineer", "TCS")
- **Card View**: Profile pictures, names, companies, skills, and verification status
- **Detailed Profiles**: Comprehensive alumni profiles with bio and contact preferences

### 🎓 Mentorship System
- **Find Mentors**: Browse available mentors by expertise and availability
- **Request System**: Send mentorship requests with time slots and subject
- **Status Tracking**: Monitor request status (Pending/Accepted/Declined)
- **Time Slot Management**: Flexible scheduling system

### 📅 Events Management
- **Event Types**: Reunions, Webinars, Hackathons, Networking events
- **RSVP System**: Attend/Maybe/Can't Attend options
- **Event Details**: Date, time, location, participant tracking
- **Registration Tracking**: Real-time participant count and capacity

### 💰 Donation Platform
- **Multiple Causes**: Infrastructure, Scholarships, Research, Events
- **Payment Integration**: UPI and Razorpay support
- **Progress Tracking**: Visual progress bars and donation goals
- **Transaction Management**: Secure payment processing and receipts

### 📊 Admin Dashboard
- **Analytics**: Verified alumni, active mentors, events, donations
- **Visual Charts**: Pie charts and bar graphs for engagement metrics
- **Activity Feed**: Real-time activity monitoring
- **Quick Actions**: Event creation, alumni verification, reports

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons and Lucide React
- **State Management**: React useState hooks
- **Routing**: Next.js App Router

## Project Structure

```
src/
├── app/
│   ├── admin/                 # Admin dashboard
│   ├── auth/
│   │   ├── login/            # Login page with OTP and social login
│   │   └── signup/           # Signup with role selection
│   ├── directory/            # Alumni directory with search and filters
│   ├── donations/            # Donation platform
│   ├── events/               # Events listing and RSVP
│   ├── mentorship/           # Mentor discovery and requests
│   ├── profile/[id]/         # Dynamic alumni profiles
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout with navigation
│   └── page.tsx              # Homepage with hero section
└── components/
    ├── hero-section.tsx      # Homepage hero component
    └── navbar.tsx            # Navigation component
```

## Key Components

### Authentication Flow
1. **Role Selection**: Users choose between Alumni, Student, or Admin
2. **Form Validation**: Role-specific form fields and validation
3. **Email Verification**: OTP-based email verification
4. **Social Login**: Integration with Google, LinkedIn, and GitHub

### Alumni Directory
- Advanced search functionality
- Dynamic filtering system
- Responsive card-based layout
- Profile preview with quick actions

### Mentorship Platform
- Mentor availability tracking
- Time slot selection system
- Request management workflow
- Communication preferences

### Event Management
- Multi-type event support
- RSVP tracking system
- Capacity management
- Progress visualization

### Donation System
- Multiple campaign support
- Payment method integration
- Progress tracking
- Donor information management

### Admin Dashboard
- Real-time statistics
- Visual analytics
- Activity monitoring
- Management tools

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

## Features in Detail

### 🎯 User Experience
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Intuitive Navigation**: Clear navigation structure
- **Fast Loading**: Optimized with Next.js App Router
- **Accessibility**: ARIA labels and keyboard navigation

### 🔒 Security
- **Email Verification**: OTP-based verification system
- **Role-based Access**: Different access levels for different user types
- **Secure Payments**: Integration with trusted payment providers

### 📱 Mobile Responsive
- **Mobile Navigation**: Collapsible menu for mobile devices
- **Touch-friendly**: Optimized for touch interactions
- **Responsive Grids**: Adaptive layouts for all screen sizes

## Future Enhancements

- [ ] Real-time messaging system
- [ ] Advanced analytics dashboard
- [ ] Email notification system
- [ ] File upload for profile pictures
- [ ] Calendar integration for events
- [ ] Push notifications
- [ ] Advanced search with AI recommendations
- [ ] Video calling integration for mentorship
- [ ] Multi-language support
- [ ] Dark mode theme

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@alumniconnect.com or join our Slack channel.

---

Built with ❤️ by the Alumni Connect Team
