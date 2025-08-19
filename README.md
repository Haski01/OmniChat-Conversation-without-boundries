# 🌐 OmniChat-Communication without boundries

OmniChat is a modern chat-based web application that enables users to **connect, learn new languages,
send friend requests, chat in real-time, and start audio/video calls**.  
It is designed to make communication more engaging and interactive while providing a seamless user experience.

---

## 🚀 Features

- 🔑 **User Authentication**  
  - Secure signup and login system.  
  - JWT-based authentication with cookies.

- 👤 **Onboarding & Profile Setup**  
  - Upload profile picture.  
  - Update full name, bio, location.  
  - Select native and learning languages.

- 🏠 **Home Page Experience**  
  - Sidebar, Navbar, Suggested Friends & Friends List.  
  - Send friend requests to suggested users.  
  - Accept/decline friend requests.  

- 💬 **Real-time Chat**  
  - Chat with friends once requests are accepted.  
  - Powered by Stream Chat for reliable messaging.  

- 🎥 **Video Calls**  
  - Initiate video calls directly from chat.  
  - Call links are sent inside the chat for quick joining.  

- 🌍 **Language Learning Community**  
  - Connect with people learning or teaching new languages.  

---

## 🛠️ Tech Stack

### **Frontend**
- React
- Vite
- Tailwind CSS + DaisyUI : Prebuilt Tailwind components to speed up UI building.
- Zustand (state management)  
- React Router  
- React Hot Toast (notifications)  
- Axios (API requests)  
- React Query (data fetching)  
- Stream Chat React  
- Stream Video React SDK  
- Lucide React (icons)

### **Backend**
- Node.js  
- Express.js  
- Mongoose (MongoDB ODM)  
- JWT (authentication)  
- Bcrypt.js (password hashing)  
- Cookie Parser  
- CORS  
- Dotenv  
- Stream Chat (server-side integration)

---

## ⚡ Installation & Setup
--

#### 1️⃣ Clone the repository

--

#### 🧪 .env Setup
--

####  Backend (/backend)
```env
PORT=5001
MONGO_URI=your_mongo_uri
STEAM_API_KEY=your_steam_api_key
STEAM_API_SECRET=your_steam_api_secret
JWT_SECRET_KEY=your_jwt_secret
NODE_ENV=development
```

####  Frontend (/frontend)
```.env
VITE_STREAM_API_KEY=your_stream_api_key
```

---

### 🔧 Run the Backend
--

```bash
cd backend
npm install
npm run dev
```

### 💻 Run the Frontend
--

```bash
cd frontend
npm install
npm run dev
```

