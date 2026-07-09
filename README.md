# 🌿 Learnora — Digital Life Lessons

> *Preserve your wisdom. Share your growth. Learn from each other.*

Learnora is a full-stack platform where people can capture the life lessons, personal growth insights, and hard-earned wisdom they've collected over time — and share them with a community of reflective learners. Instead of letting valuable lessons fade with memory, Learnora turns them into a living, searchable, and shareable archive.

---

## 🔗 Live Project

| Resource | Link |
|---|---|
| 🌐 Live Site | (https://learnora-client-main.vercel.app/) |

---

## 🎯 Purpose

People often learn valuable lessons through experience — but without a place to record and revisit them, that wisdom is quickly forgotten. Learnora was built to:

- Help users **preserve personal wisdom** in an organized, structured way
- Encourage **mindful reflection** on past mistakes, growth, and gratitude
- Let users **explore and learn from lessons shared by others** in the community
- Reward depth and consistency through a **Free vs Premium** experience, where premium members unlock exclusive lessons and creation privileges

---

## ✨ Key Features

### 🔐 Authentication
- Secure email/password and Google login powered by **Better Auth**
- Token-based session verification on all protected routes
- Persistent sessions — no unwanted redirects to login on page reload

### 📖 Lesson Management
- Create, update, and delete personal life lessons with title, description, category, emotional tone, and an optional image
- Choose **Visibility** (Public / Private) and **Access Level** (Free / Premium) per lesson
- Premium-only lessons are blurred and locked for Free users with an "Upgrade to Premium" prompt

### 🌍 Public Lessons Explorer
- Browse all publicly shared lessons in a clean, equal-sized card layout
- **Search, filter, and sort** by title, category, emotional tone, and recency/popularity
- Pagination for smooth browsing through large lesson collections

### ❤️ Engagement & Community
- Like and save lessons to a personal **Favorites** list with real-time, optimistic UI updates
- Comment on lessons and join the conversation
- Report inappropriate content with a reason dropdown, routed to the admin queue
- Share lessons directly to Facebook, X, WhatsApp, and LinkedIn

### 💳 Premium Membership
- One-time lifetime upgrade via **Stripe Checkout**
- Free vs Premium comparison table outlining exactly what premium unlocks
- Instant UI sync across the app after a successful payment — no hard reload needed

### 📊 Dashboards
- **User Dashboard:** overview stats, lesson management, favorites, and a personal analytics chart
- **Admin Dashboard:** platform-wide analytics, user role management, lesson moderation, and a full reported-content review workflow
- Interactive charts for lesson growth, category breakdowns, and top contributors

### 🎨 Design & Experience
- Fully responsive across mobile, tablet, and desktop
- Smooth, purposeful motion using **Framer Motion**
- Consistent design language, button styles, and spacing across every page
- Dark / light theme toggle

---

## 📦 NPM Dependencies

### Client
| Package | Purpose |
|---|---|
| `next` | React framework — routing, SSR, and app structure |
| `react` / `react-dom` | UI library |
| `better-auth` | Authentication (email/password + Google OAuth) |
| `motion` (Framer Motion) | Animations and transitions |
| `tailwindcss` | Utility-first styling |
| `lucide-react` | Icon set used across the UI |
| `recharts` | Dashboard charts and analytics graphs |
| `react-hot-toast` | Toast notifications for success/error states |
| `react-share` | Social sharing buttons (Facebook, X, WhatsApp, LinkedIn) |
| `axios` / native `fetch` | API communication with the server |

### Server
| Package | Purpose |
|---|---|
| `express` | REST API framework |
| `mongodb` | Database driver for MongoDB Atlas |
| `cors` | Cross-origin request handling |
| `dotenv` | Environment variable management |
| `stripe` | Payment processing for Premium upgrades |
| `better-auth` | Server-side session and token verification |

---

## 📂 Database Collections

| Collection | Key Fields |
|---|---|
| `users` | name, email, photoURL, isPremium, role |
| `lessons` | title, description, category, emotionalTone, visibility, accessLevel, likes[], likesCount, favoritesCount, isFeatured, isReviewed, creatorId |
| `lessonsReports` | lessonId, reporterUserId, reportedUserEmail, reason, timestamp |
| `favorites` | userId, lessonId, savedAt |
| `comments` | lessonId, userId, text, createdAt |

---

## 🛠️ Technologies Used

| Category       | Technologies                                                                                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**   | React, React Router DOM, Tailwind CSS, DaisyUI, Axios, TanStack Query, Better Auth Client, React Hook Form, Framer Motion, React Hot Toast, SweetAlert2, Recharts, React Icons, React Share |
| **Backend**    | Node.js, Express.js, MongoDB, Better Auth, Stripe, JWT (JSON Web Token), CORS, Dotenv, Cookie Parser                                                                                        |
| **Database**   | MongoDB Atlas                                                                                                                                                                               |
| **Deployment** | Firebase / Vercel (Client), Render / Railway / Vercel (Server), MongoDB Atlas                                                                                                               |
---

## 👤 Admin Access (for evaluation)

| Field | Value |
|---|---|
| Admin Email | `Jubair34@gmail.com` |
| Admin Password | `Jubair34` |

---

## 2. Install dependencies

### Client

```bash

cd learnora-client

npm install

```

### Server

```bash

cd learnora-server

npm install

```

---

## 3. Configure Environment Variables



Create a `.env` file in both the client and server folders and add the required environment variables.

---

## 4. Start the backend

```bash

npm run dev

```

---

## 5. Start the frontend

```bash

npm run dev

```

---

## 6. Open the application

```

http://localhost:3000

```

---

# 👨‍💻 User Roles



## Free User



* Create Free Lessons

* Browse Public Lessons

* Save Favorites

* Like & Comment

* Upgrade to Premium



## Premium User



* Access Premium Lessons

* Publish Premium Lessons

* Lifetime Premium Access

* Premium Badge



## Admin



* Manage Users

* Manage Lessons

* Review Reports

* Feature Lessons

* Platform Analytics

---

# 🔒 Security Features


* Better Auth Authentication

* Protected Routes

* JWT Token Verification

* Role-based Authorization

* Secure Environment Variables

* MongoDB Credentials Hidden

* Stripe Webhook Verification

---

# 🎯 Core Functionalities



* Authentication System

* Premium Subscription

* Lesson Management

* Favorites System

* Likes & Comments

* Lesson Reporting

* Admin Dashboard

* Featured Lessons

* Public Lesson Discovery

* Search, Filter & Sort

* Pagination

* Responsive Design

* Animated UI

---

# 📌 Future Improvements



* AI-generated lesson summaries

* Bookmark folders

* User following system

* Notifications

* Rich text editor

* Lesson drafts

* Multi-language support

---

<p align="center">Built with care, one life lesson at a time. 🌱</p>
