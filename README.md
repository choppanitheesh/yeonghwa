# 🎬 yeonghwa - The Movie Platform

**yeonghwa** is a modern, full-stack movie discovery application built with the **MERN Stack** (MongoDB, Express, React, Node.js). It offers a premium user experience similar to Netflix or Apple TV, featuring a sleek dark UI, real-time search, personalized recommendations, and a responsive design that works beautifully on all devices.

![yeonghwa Screenshot](https://res.cloudinary.com/djni7gwm4/image/upload/v1765447095/Screenshot_2025-12-11_152749_lxdumf.png)

---

## ✨ Features

### **User Experience (UX)**
* **Netflix-Style Hero Banner:** Auto-sliding banner with high-res backdrops and "Watch Trailer" integration.
* **Infinite Scrolling:** Browse thousands of movies without pagination, optimized with virtualization for performance.
* **Dynamic Backgrounds:** Movie detail pages extract the dominant color from the poster to create an immersive ambient glow.
* **Responsive Design:** Fully optimized for Mobile, Tablet, and Desktop with specific UI adjustments for smaller screens.

### **Discovery & Content**
* **Smart Search:** Instant search for Movies and TV Shows with a "Recent History" dropdown.
* **Trending & Upcoming:** Real-time data from the TMDB API.
* **Franchise Collections:** View entire movie series (e.g., Avengers, Harry Potter) in chronological order.
* **Cast Profiles:** Click on any actor to see their bio and filmography.

### **User Accounts (Auth)**
* **Secure Authentication:** JWT-based Signup and Login system.
* **Custom Avatars:** Choose from a curated list of Pokémon/Character avatars during registration.
* **Wishlist System:** Save movies to your personal library (synced to the database).
* **Password Reset:** Secure "Forgot Password" flow using email verification (Nodemailer).

---

## 🛠️ Tech Stack

### **Frontend**
* **React (Vite):** Fast, modern UI library.
* **Tailwind CSS:** Utility-first styling for a custom, responsive design.
* **Framer Motion:** Smooth page transitions and micro-interactions.
* **TanStack Query:** Efficient data fetching and caching.
* **Zustand:** Lightweight global state management (User auth, Wishlist).
* **React Icons:** Comprehensive icon library.

### **Backend**
* **Node.js & Express:** Robust REST API server.
* **MongoDB (Atlas):** NoSQL database for storing Users and Wishlists.
* **Mongoose:** ODM for data modeling.
* **JWT & Bcrypt:** Security standards for authentication and password hashing.
* **Nodemailer:** Email service for password resets.

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### **1. Prerequisites**
* **Node.js** (v16 or higher) installed.
* **MongoDB Atlas** account (or local MongoDB).
* **TMDB API Key** (Get one for free at [themoviedb.org](https://www.themoviedb.org/documentation/api)).
* **Gmail Account** (For sending reset emails - requires an [App Password](https://myaccount.google.com/apppasswords)).

### **2. Installation**

Clone the repository:
```bash
git clone [https://github.com/choppanitheesh/yeonghwa.git](https://github.com/choppanitheesh/yeonghwa.git)
cd yeonghwa
