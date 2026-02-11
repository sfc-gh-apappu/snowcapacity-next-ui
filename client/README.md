# SnowCapacity Management Portal

A modern, sleek capacity management and resource allocation platform built with Next.js, TypeScript, and Tailwind CSS.

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📋 Features

### 🏠 Dashboard (Home)
- Real-time metrics and statistics
- Activity feed with recent events
- Quick overview of system status
- Beautiful card-based layout

### 📊 Capacity Overview
- Monitor storage pools in real-time
- Visual capacity indicators with color-coded alerts
- Track usage trends and growth rates
- Automatic warnings for high utilization

### 📝 Request Management
- Submit and track capacity requests
- Filter by status (Pending, Approved, Rejected)
- Searchable request history
- Quick approval workflow

### 💾 Quota Management
- Allocate resources to teams
- Monitor team usage and trends
- Bulk quota updates
- Usage analytics and insights

### 📅 Reservations
- Schedule resource reservations
- Timeline view of all bookings
- Track active and upcoming reservations
- Manage reservation lifecycle

## 🎨 Design Highlights

- **Modern UI**: Clean, professional interface with smooth animations
- **Responsive**: Works seamlessly on desktop, tablet, and mobile
- **Accessible**: WCAG compliant with proper focus states
- **Consistent**: Unified design system across all pages
- **Intuitive**: Easy-to-use navigation with clear visual hierarchy

## 🛠️ Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Fonts**: Geist Sans & Geist Mono

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx                 # Root layout with sidebar
│   ├── page.tsx                   # Home/Dashboard
│   ├── capacity-overview/         # Capacity monitoring
│   ├── request/                   # Request management
│   ├── quota/                     # Quota allocation
│   └── reservation/               # Reservation scheduling
└── components/
    └── Sidebar.tsx                # Global navigation
```

## 🎯 Navigation

The app features a fixed sidebar with the following pages:

- **Home** (/) - Dashboard overview
- **Capacity Overview** (/capacity-overview) - Storage monitoring
- **Request** (/request) - Request management
- **Quota** (/quota) - Team quotas
- **Reservation** (/reservation) - Resource reservations

## 🚧 Development

### Prerequisites
- Node.js 20+
- npm or yarn

### Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 📝 Notes

- Currently uses mock data for demonstration
- All components are custom-built (no external UI library)
- Fully typed with TypeScript
- Ready for API integration

## 🔜 Future Enhancements

- [ ] API integration
- [ ] Authentication system
- [ ] Dark mode
- [ ] Real-time notifications
- [ ] Data visualization charts
- [ ] Export functionality
- [ ] Calendar view for reservations

## 📄 License

Private project for SnowCapacity

---

Built with ❤️ using Next.js
