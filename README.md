# 🍔 Reel Feature (Food Reels)

A full-stack web application that brings the engaging "Reels" experience to food discovery. This project enables users to scroll through short-form food videos, like/save content, and allows Food Partners (Restaurants) to upload and manage their own marketing videos.

## ✨ Features

### 👤 For Users
*   **Immersive Video Feed**: Full-screen, vertical scrolling video feed (TikTok/Reels style) with snap scrolling.
*   **Interactive Engagement**:
    *   ❤️ **Like** videos (with optimistic UI updates).
    *   🔖 **Save** delicious finds for later.
    *   🔊 **Audio Control**: Toggle mute/unmute globally.
*   **Smart Playback**: Videos autoplay when they come into view and pause when scrolled away.
*   **Partner Discovery**: "Visit Store" button to view the Food Partner's full profile and menu.

### 👨‍🍳 For Food Partners (Restaurants)
*   **Dedicated Portal**: Separate Register/Login flow for businesses.
*   **Content Creation**: Upload food videos with titles and descriptions.
*   **Partner Dashboard**:
    *   View all uploaded videos.
    *   Track basic stats (Meals Served/Customer Reach).
    *   **Management**: Delete old or unwanted videos directly from the dashboard.
*   **Profile Page**: A public-facing profile page showcasing the restaurant's details and all their video reels.

### ⚙️ Technical Highlights
*   **Skeleton Loading**: Premium skeleton loaders for a smooth initial load experience.
*   **Optimistic UI**: Instant feedback on interactions (Likes/Saves) before the server responds.
*   **Responsive Design**: Mobile-first styling that looks great on Mobile devices.
*   **Cloud Database**: Connected to MongoDB Atlas for persistent data storage.

---

## 🛠️ Tech Stack

### Frontend
*   **React (Vite)**: Fast and modern UI library.
*   **React Router**: For client-side routing.
*   **Axios**: For API requests.
*   **Lucide React**: For beautiful, consistent icons.
*   **CSS3**: Custom styling with variables and modern layout techniques (Flexbox/Grid).

### Backend
*   **Node.js & Express**: Robust REST API.
*   **MongoDB & Mongoose**: NoSQL database for flexible data modeling.
*   **JWT & Cookies**: Secure authentication for both Users and Partners.
*   **Multer**: Handling file uploads.
*   **ImageKit**: (Integrated) For media handling/storage.

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v16+)
*   MongoDB Atlas Account (or local MongoDB)

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd Zomato_Reel_Feat
    ```

2.  **Setup Backend**
    ```bash
    cd backend
    npm install
    ```
    *   Create a `.env` file in the `backend` directory:
        ```env
        PORT=3000
        MONGODB_URI=your_mongodb_atlas_connection_string
        JWT_SECRET=your_jwt_secret
        # Add ImageKit credentials if required
        ```
    *   Start the server:
        ```bash
        node server.js
        # OR
        npm run dev (if nodemon is set up)
        ```

3.  **Setup Frontend**
    ```bash
    cd ../frontend/reel_food
    npm install
    ```
    *   Start the React app:
        ```bash
        npm run dev
        ```

4.  **Access the App**
    *   Frontend: `http://localhost:5173`
    *   Backend: `http://localhost:3000`

---

## 📂 Project Structure

```
Zomato_Reel_Feat/
├── backend/                 # Node.js/Express Server
│   ├── src/
│   │   ├── controllers/     # Logic for Auth, Food, Partners
│   │   ├── models/          # Mongoose Schemas (User, Food, Save, Like)
│   │   ├── routes/          # API Routes
│   │   └── middlewares/     # Auth checks
│   ├── server.js            # Entry point
│   └── .env                 # Env variables
│
└── frontend/reel_food/      # React Application
    ├── src/
    │   ├── components/      # Reusable UI (BottomNav, etc.)
    │   ├── home/            # Main Feed Logic (Home.jsx)
    │   ├── foodPartner/     # Partner specific pages (Dashboard, Create)
    │   └── pages/           # Auth & Utility pages (Login, Register)
    └── public/              # Static assets
```


## 🌐 Portfolio

Check out my other projects and work here:
[**My Portfolio**](https://aditya-dev-portfolio-iota.vercel.app/)

---

*Built with ❤️ for foodies.*
