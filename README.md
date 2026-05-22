# GovBridge India

**GovBridge India** is a personalized, AI-driven government benefits platform that helps citizens discover, track, and apply for relevant government schemes based on their individual profile.

## 🚀 Features

- **Personalized Recommendations:** Get matching government schemes based on your age, occupation, income, state, and more.
- **GovBot (AI Assistant):** Talk to the integrated AI Chatbot to ask questions about specific schemes, eligibility criteria, and application processes.
- **Multilingual Support:** Browse the site in Kannada, Hindi, Telugu, Tamil, Malayalam, or English using the Google Translate widget.
- **Profile Management:** A detailed, dynamic profile system that securely saves user data to find the best-matched benefits.
- **Dashboard Tracking:** View how many schemes you qualify for, browse recommended schemes, and track the ones you have already applied to.

## 🛠️ Technology Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS, Framer Motion, Lucide-React
- **Backend:** Node.js, Express.js
- **Database / Auth:** Firebase (Firestore, Authentication, Admin SDK)
- **AI Integration:** LangChain, Google Gemini/OpenAI (for GovBot)

## 📁 Project Structure

This is a monorepo consisting of a `client` and a `server` directory.

- `/client` - Next.js frontend application.
- `/server` - Express.js backend API.

## 💻 Running Locally

To run the application locally, you must start both the frontend and backend servers.

### 1. Backend Setup

```bash
cd server
npm install
# Ensure you have your Firebase Service Account JSON and .env variables set up
npm run dev
```
The backend server will run on `http://localhost:5000`.

### 2. Frontend Setup

```bash
cd client
npm install
# Ensure you have your Firebase client credentials in .env.local
npm run dev
```
The frontend will start on `http://localhost:3000`. It is configured to automatically proxy API requests to the backend.

## 🔗 Environment Variables

You will need to set up the following environment variables:

**Client (`client/.env.local`):**
- `NEXT_PUBLIC_API_URL`
- Firebase Client Config variables (`NEXT_PUBLIC_FIREBASE_API_KEY`, etc.)

**Server (`server/.env`):**
- `PORT` (defaults to 5000)
- `FIREBASE_SERVICE_ACCOUNT_PATH`

## 🤝 Contribution

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.
