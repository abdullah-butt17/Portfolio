# Abdullah Butt — Full-Stack Developer & AI Engineer

<p align="center">
  <strong>Building Digital Solutions That Matter.</strong>
</p>

<p align="center">
  A modern, full-stack developer portfolio showcasing projects, technical expertise, and software engineering experience.
</p>

<p align="center">
  <a href="https://www.abdullahbutt.dev">
    <img src="https://img.shields.io/badge/Live%20Portfolio-abdullahbutt.dev-0A66C2?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Portfolio" />
  </a>
  <a href="https://github.com/abdullah-butt17">
    <img src="https://img.shields.io/badge/GitHub-Abdullah%20Butt-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
  <a href="https://www.linkedin.com/in/abdullah-butt-92939436a/">
    <img src="https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
</p>

---

## 🌐 Portfolio Preview

<p align="center">
  <a href="https://www.abdullahbutt.dev">
    <img src="https://res.cloudinary.com/ntx8ixhh/image/upload/v1795855896/Screenshot_2026-11-28_134857_khu2ms.png" alt="Abdullah Butt - Full-Stack Developer and AI Engineer Portfolio Homepage" width="100%" />
  </a>
</p>

<p align="center">
  <a href="https://www.abdullahbutt.dev"><strong>Explore Live Portfolio →</strong></a>
</p>

## 📌 About the Project

This repository contains my personal portfolio website, developed to establish my professional online presence and showcase my journey as a Full-Stack Developer and Artificial Intelligence student.

The platform is designed to present my technical skills, featured projects, certifications, and development experience through a modern and responsive interface.

Beyond being a personal website, it is a full-stack application featuring a dedicated backend API, database integration, and an administrative dashboard for dynamically managing portfolio content.

## ✨ Key Features

- **Modern UI/UX** — Clean, professional, and visually engaging interface.
- **Responsive Design** — Optimized for desktops, tablets, and mobile devices.
- **Dynamic Projects Showcase** — Display projects with descriptions, technologies, screenshots, and demonstrations.
- **Admin Dashboard** — Dedicated administrative interface for managing website content.
- **Content Management** — Dynamically manage projects, skills, certificates, profile information, and media.
- **Media Management** — Handle project images, screenshots, and demo videos.
- **RESTful API** — Structured backend API for application functionality.
- **Database Integration** — MongoDB and Mongoose for data persistence.
- **Authentication & Security** — JWT authentication, password hashing, protected operations, and security middleware.
- **Cloud Media Storage** — Cloudinary integration for media uploads and management.
- **SEO Optimization** — Metadata, canonical URLs, Open Graph, structured data, sitemap, and robots configuration.
- **Performance Optimization** — Optimized frontend delivery and Vercel Analytics integration.

## 🛠️ Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| Next.js | React framework and application routing |
| React | Component-based user interface |
| TypeScript | Type safety and maintainable code |
| Tailwind CSS | Responsive styling and UI design |
| Lucide React | Icon library |
| Vercel Analytics | Website analytics |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Backend API framework |
| MongoDB | NoSQL database |
| Mongoose | Database modeling |
| JWT | Authentication |
| Bcrypt.js | Password hashing |
| Cloudinary | Cloud-based media management |
| Multer | File upload handling |
| Helmet | HTTP security headers |
| Express Rate Limit | API rate limiting |
| Express Validator | Request validation |

### Tools & Deployment

- Git & GitHub
- Visual Studio Code
- Vercel
- MongoDB Atlas
- Cloudinary

## 🏗️ Project Architecture

The application follows a separated frontend and backend architecture.

```text
Portfolio/
│
├── frontend/
│   ├── app/
│   │   ├── (site)/
│   │   ├── admin/
│   │   ├── api/
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   ├── lib/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   │
│   └── package.json
│
├── .gitignore
└── README.md
```

*This is a conceptual overview of the main application areas, not an exhaustive directory listing.*

## ⚙️ Getting Started

Follow these instructions to set up the project locally.

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm
- [MongoDB Atlas](https://www.mongodb.com/atlas) or a local MongoDB instance
- [Cloudinary](https://cloudinary.com/) account

### 1. Clone the Repository

```bash
git clone https://github.com/abdullah-butt17/Portfolio.git
```

```bash
cd Portfolio
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
npm install
```

Configure the backend environment variables in a `.env` file according to the application's configuration.

Typical settings include:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the backend using the development script configured in `backend/package.json`:

```bash
npm run dev
```

### 3. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
```

Configure the frontend environment variables according to the application's API configuration.

Start the development server:

```bash
npm run dev
```

### 4. Open the Application

Visit:

```text
http://localhost:3000
```

### 5. Production Build

To generate a production build:

```bash
cd frontend
npm run build
```

Start the production server:

```bash
npm run start
```

**Note:** Environment variable names and available npm scripts should be checked against the actual project configuration before running the application.

## 🔐 Security

Security and data protection are important considerations in the application.

Implemented security measures include:

- JWT-based authentication.
- Password hashing with Bcrypt.
- Protected administrative operations.
- Request validation.
- HTTP security headers.
- API rate limiting.
- Database query sanitization.
- Environment-based configuration.

Sensitive credentials and environment variables should never be committed to the repository.

## 🔍 SEO & Performance

The portfolio incorporates search engine optimization and performance improvements to improve discoverability and user experience.

SEO implementation includes:

- Search engine metadata.
- Canonical URLs.
- Open Graph metadata.
- JSON-LD structured data.
- XML sitemap.
- Robots configuration.
- Search Console integration.
- Optimized website delivery.
- Vercel Analytics.

## 🚀 Deployment

The portfolio frontend is deployed using **Vercel**.

<blockquote>
  **Production Website**

  https://www.abdullahbutt.dev
</blockquote>

The application uses external services for database connectivity and media storage. Production configuration requires the appropriate environment variables, database connection, and backend API integration.

## 👨‍💻 About the Developer

I'm **Abdullah Butt**, a BS Artificial Intelligence student and Full-Stack Developer passionate about building practical software solutions and intelligent applications.

I enjoy combining software engineering principles with modern technologies to develop scalable, useful, and user-focused applications.

### Areas of Interest

- Full-Stack Web Development
- Artificial Intelligence & Machine Learning
- Python Development
- REST API Development
- Database Design & Management
- Software Engineering

I'm continuously learning, building real-world projects, and exploring new technologies to improve my development skills.

## 📬 Connect With Me

I'm always open to connecting with developers, collaborating on interesting projects, and exploring new opportunities.

<p align="center">
  <a href="https://www.abdullahbutt.dev">
    <img src="https://img.shields.io/badge/Website-Visit%20Portfolio-0A66C2?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Website" />
  </a>
  <a href="https://github.com/abdullah-butt17">
    <img src="https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
  <a href="https://www.linkedin.com/in/abdullah-butt-92939436a/">
    <img src="https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
</p>

---

<p align="center">
  <strong>Building. Learning. Innovating.</strong>
</p>

<p align="center">
  If you find this project interesting, consider giving it a ⭐ on GitHub.
</p>

<p align="center">
  © 2026 Abdullah Butt. All Rights Reserved.
</p>
