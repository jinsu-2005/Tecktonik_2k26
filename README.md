# TECHTONIK ’26 | National Level Technical Symposium

A modern, high-performance web application designed for the **TECHTONIK ’26** National Level Technical Symposium. This project features a stunning glassmorphism UI, interactive shooting star animations, and a serverless backend for participant registration.

## 🚀 Live Demo
The project is designed to be deployed on **Netlify** using Netlify Functions.

## ✨ Features
- **Modern UI/UX**: Built with a sleek glassmorphism theme, neon accents, and responsive design.
- **Dynamic Background**: Interactive shooting star animation system built with CSS and JavaScript.
- **Categorized Registrations**: Participants can select from curated Technical and Non-Technical events.
- **Serverless Backend**: Uses Netlify Functions (`api.js`) to handle data submission and retrieval.
- **CSV Data Storage**: All registration data is stored in a `registrations.csv` file for easy access and portability.
- **Admin Dashboard**: A secure-locked participants' list protected by password authentication.
- **Mobile Responsive**: Fully optimized for all screen sizes, ensuring a perfect view on both desktop and mobile.

## 🛠️ Technology Stack
- **Frontend**: HTML5, Vanilla CSS (Modern CSS3 animations), Vanilla JavaScript.
- **Backend**: Node.js via **Netlify Functions**.
- **Database**: Local `CSV` file storage (`registrations.csv`).
- **Deployment**: Netlify.

## 📂 Project Structure
```text
├── index.html          # Main landing page & registration form
├── styles.css          # Design system, animations & responsive styles
├── script.js           # Frontend logic & star generation
├── registrations.csv   # Database for participant records
├── netlify.toml        # Netlify configuration settings
└── netlify/
    └── functions/
        └── api.js      # Backend API handling POST/GET requests
```

## ⚙️ Local Development
1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   ```
2. Install Netlify CLI (if not already installed):
   ```bash
   npm install netlify-cli -g
   ```
3. Run the development server:
   ```bash
   netlify dev
   ```
   The application will be available at `http://localhost:8888`.

## 🔒 Security
The "View Participants" section is protected by a client-side password. 
- **Default Admin Password**: `admin` (Can be modified in `script.js`).

## 👨‍💻 Author
**Created by Jinsu J**  
*3rd Year – Department of Information Technology*

---
*Created for the Techtonik Symposium '26.*
