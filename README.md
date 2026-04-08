# 🚀 DevCollab Hub

> A full-stack **Developer Collaboration Platform** built with the MERN stack.
> Connect, collaborate, and build projects with developers worldwide.

---

## 🌟 Overview

DevCollab Hub helps developers:

* 🤝 Find teammates based on skills
* 💡 Post and discover project ideas
* 💬 Collaborate in real-time
* 📊 Track applications and team progress

---

## ✨ Features

* 🔐 **Authentication** — JWT-based login/register with bcrypt security
* 👤 **Developer Profiles** — Skills, experience, GitHub integration
* 📁 **Project Management** — Create, browse, filter projects
* 🎯 **Skill Matching System** — Smart % match algorithm
* 📬 **Application System** — Apply / Accept / Reject
* 👥 **Team Management** — Auto team building with limits
* 💬 **Real-time Chat** — Socket.io powered project chats
* 🔔 **Notifications** — Live alerts for updates
* ⭐ **Bookmarks** — Save projects
* 🐙 **GitHub Integration** — Repo + language insights

---

## 🧱 Tech Stack

| Layer          | Technology                  |
| -------------- | --------------------------- |
| Frontend       | React + Vite + Tailwind CSS |
| Backend        | Node.js + Express.js        |
| Database       | MongoDB + Mongoose          |
| Authentication | JWT + bcryptjs              |
| Real-time      | Socket.io                   |
| API Client     | Axios                       |
| Icons          | Lucide React                |

---

## 📂 Project Structure

```
dev-collab-hub/
├── backend/
├── frontend/
└── README.md
```

> Clean MVC architecture with services layer & socket integration

---

## ⚙️ Setup Instructions

### 🔹 1. Clone the repo

```bash
git clone https://github.com/18sahhhilll/DevCollab.git
cd DevCollab
```

---

### 🔹 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

Run backend:

```bash
npm run dev
```

---

### 🔹 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

### 🔹 4. Open App

👉 http://localhost:5173

---

## 📡 API Overview

### Auth

* POST `/api/auth/register`
* POST `/api/auth/login`

### Projects

* GET `/api/projects`
* POST `/api/projects`
* GET `/api/projects/match`

### Applications

* Apply, accept, reject users

### Chat

* Real-time messaging via Socket.io

---

## 🧠 Matching Algorithm

```js
matchScore = (matchedSkills / requiredSkills) * 100
```

✔ Case-insensitive
✔ Sorted results
✔ Returns matched + missing skills

---

## 🔐 Environment Variables

Create `.env` in backend:

```
MONGO_URI=your_database_url
JWT_SECRET=your_secret
```

---

## 📸 Screenshots (Add later)

> Add UI screenshots here to improve your repo 🔥

---

## 🚀 Future Improvements

* 🌐 Deployment (Render / Vercel)
* 🤖 AI skill suggestions
* 📊 Advanced analytics dashboard
* 🔍 Smart search & recommendations

---

## 🤝 Contributing

Pull requests are welcome.
For major changes, open an issue first.

---

## 👨‍💻 Author

**Sahil Sangle**

* 💼 Aspiring Full Stack Developer
* 🚀 MERN Stack Enthusiast

---

## ⭐ Support

If you like this project:

👉 Star the repo
👉 Fork it
👉 Share it

---

🔥 Built with passion using MERN Stack
