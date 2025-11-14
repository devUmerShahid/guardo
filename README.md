# Guardo - Password Manager

## Demo

👉 https://guardo-eight.vercel.app/

Guardo is a secure and user-friendly password manager built with **React.js**, **Vite**, and **Firebase**. It allows users to store, edit, delete, and manage passwords efficiently with strong security and smooth UI/UX.

## Features

- Add, edit, and delete passwords
- View passwords securely
- Password strength indicator
- Responsive design for mobile and desktop
- User authentication (Login, Register, Reset Password)
- Pagination for password lists
- Firebase Firestore backend
- Secure handling of environment variables

## Technologies

- React.js with Vite
- TypeScript (optional, if used)
- Firebase Auth & Firestore
- Tailwind CSS
- React Icons

## Installation

Follow these steps to run the project locally:

1. **Clone the repository**
```bash
git clone https://github.com/devUmerShahid/guardo.git
cd guardo

2. **Install dependencies**

npm install
# or
yarn install

3. **Set up Firebase**

Create a Firebase project at Firebase Console

Enable Email/Password Authentication and Firestore Database

Create a .env file in the root directory with the following variables:
-VITE_FIREBASE_API_KEY=your_api_key
-VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
-VITE_FIREBASE_PROJECT_ID=your_project_id
-VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
-VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
-VITE_FIREBASE_APP_ID=your_app_id

Note: Do NOT commit .env to GitHub. Use .gitignore to exclude it.

4.**Run the project locally**

npm run dev
# or
yarn dev

Open http://localhost:5173 in your browser.

License

MIT License © 2025
