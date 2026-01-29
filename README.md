# **BookIt | Faculty-Student Appointment System**

**BookIt** is a full-stack MERN application designed to simplify and automate the process of scheduling appointments between faculty and students. It eliminates the back-and-forth of manual scheduling by providing real-time availability, AI-assisted time slots, and secure attendance verification.

## **🛠 Features**

* **Dual Dashboard:** Tailored experiences for both Faculty (to manage slots) and Students (to book them).  
* **AI-Powered Scheduling:** Suggests optimal meeting times based on user preferences and historical data.  
* **Attendance Verification:** Secure PIN and QR code generation for confirming meetings.  
* **Real-Time Notifications:** Live status updates for appointment approvals and cancellations.

## **🏗 Tech Stack**

* **Frontend:** React.js, Tailwind CSS, Lucide Icons  
* **Backend:** Node.js, Express.js  
* **Database:** MongoDB (Atlas or Local)  
* **Authentication:** JSON Web Tokens (JWT)

## **🚀 Getting Started**

### **Prerequisites**

* **Node.js** (v16.0.0 or higher)  
* **npm** or **yarn**  
* **MongoDB** (A local instance or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account)

### **Installation**

1. **Clone the Repository**  
   git clone \[https://github.com/your-username/bookit.git\](https://github.com/your-username/bookit.git)  
   cd bookit

2. **Install Backend Dependencies**  
   cd backend  
   npm install

3. **Install Frontend Dependencies**  
   cd ../frontend  
   npm install

## **🔌 Database Connectivity & Environment Variables**

To run this project, you must connect it to a MongoDB database. Follow these steps to set up your environment variables.

1. Navigate to the backend folder.  
2. Create a file named .env.  
3. Add the following line, choosing either the **Atlas** or **Local** method:

### **Option 1: MongoDB Atlas (Cloud)**

If you want to use a cloud database, log in to MongoDB Atlas, create a cluster, and get your connection string.

\# backend/.env  
MONGO\_URI=mongodb+srv://\<username\>:\<password\>@clustername.mongodb.net/bookit?retryWrites=true\&w=majority  
PORT=5000  
JWT\_SECRET=your\_super\_secret\_key\_here

### **Option 2: Local MongoDB Server**

If you have MongoDB Community Server installed on your machine:

\# backend/.env  
MONGO\_URI=mongodb://localhost:27017/bookit  
PORT=5000  
JWT\_SECRET=your\_super\_secret\_key\_here

## **🏁 Running the Application**

### **1\. Start the Backend**

From the backend directory:

npm run dev

*The server will typically start on http://localhost:5000.*

### **2\. Start the Frontend**

Open a new terminal window and navigate to the frontend directory:

npm start

*The React app will open automatically on http://localhost:3000.*

## **📁 Project Structure**

bookit/  
├── backend/          \# Express server, Models, Routes, Controllers  
│   ├── models/       \# Mongoose schemas  
│   ├── routes/       \# API endpoints  
│   └── .env          \# Environment variables (Add this\!)  
├── frontend/         \# React application  
│   ├── src/  
│   │   ├── components/  
│   │   ├── pages/  
│   │   └── context/  \# State management  
└── README.md

## **🛡 License**

This project is licensed under the MIT License. Feel free to use and modify it for your own purposes.