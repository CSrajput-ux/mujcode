# MujCode: Professional Coding & Assessment Platform

A comprehensive Learning Management System (LMS) designed for coding education, featuring automated grading, real-time analytics, and AI-powered proctoring.

## 🚀 The Problem & Solution
**The Problem:** Traditional LMS platforms lack specialized tools for coding assessments. Teachers struggle with manual grading, and online exams are prone to easy cheating, making it hard to maintain academic integrity in remote coding environments.

**The Solution:** MujCode bridges this gap by providing an integrated IDE for students and a robust automation suite for faculty. It includes **SecureExamGuard**, an AI-driven module that uses computer vision to detect unauthorized mobile phone usage and tab-switching during exams.

## ✨ Core Features
- **🎯 Student Portal:** Personalized dashboard with performance rankings, assignment tracking, and an integrated coding playground.
- **👨‍🏫 Faculty Dashboard:** Direct management of courses, automated test/quiz creation, and deep student analytics.
- **🛡️ SecureExamGuard:** AI proctoring using TensorFlow.js for mobile detection and browser-lock enforcement.
- **📊 Analytics Engine:** Real-time visualization of class performance using Recharts.
- **💬 Activity Center:** Built-in community platform for student-faculty interaction and section-wise forums.
- **⚡ Automated Grading:** Backend worker system that executes and validates code against hidden test cases.

## 🛠️ Tech Stack
- **Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Radix UI, Framer Motion.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (Activity/Submissions) & PostgreSQL (Structured User Data).
- **AI/ML:** TensorFlow.js (COCO-SSD model) for proctoring.
- **DevOps:** Vercel (Deployment), Docker (Code Execution isolation), Redis (Job Queues).

## 📂 Folder Structure
```text
mujcode/
├── MujCode Web Application UI (1)/  # Frontend React Application
│   ├── src/
│   │   ├── app/                     # Main logic and routing
│   │   ├── components/              # Shared UI components
│   │   └── pages/                   # Faculty & Student dashboards
│   └── vite.config.ts               # Vite configuration
├── backend/                         # Node.js Express API
│   ├── src/
│   │   ├── controllers/             # Request handlers
│   │   ├── models/                  # DB Schemas (Mongo + Postgres)
│   │   └── workers/                 # Code execution worker
│   └── app.js                       # API entry point
└── vercel.json                      # Deployment configuration
```

## ⚙️ Installation & Setup

1. **Clone the project:**
   ```bash
   git clone https://github.com/your-username/mujcode.git
   cd mujcode
   ```

2. **Setup Frontend:**
   ```bash
   cd "MujCode Web Application UI (1)"
   npm install
   npm run dev
   ```

3. **Setup Backend:**
   ```bash
   cd ../backend
   npm install
   # Configure your .env file with DB URLs
   npm run dev
   ```

## 🚢 Deployment
This project is configured for **Vercel**. When deploying, ensure the **Root Directory** setting on Vercel is set to `MujCode Web Application UI (1)` and the framework preset is set to **Vite**.

## 🔮 Future Improvements
- [ ] Integration of LLM-based code explanations for students.
- [ ] Support for more programming languages (Python, Java, Go).
- [ ] Real-time collaborative coding (Pair Programming mode).

## 🤝 Contributing
Contributions are what make the open-source community an amazing place to learn and create. 
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.

---
*Developed with ❤️ by a passionate student developer for the coding community.*
