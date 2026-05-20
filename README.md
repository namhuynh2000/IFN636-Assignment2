
**Assessment 1.2 (Total Marks **20**)**

Assignment: **Software requirements analysis and design (**Full-Stack CRUD Application Development with DevOps Practices**)**


---

## **Website application name:** Goal Tracking King
## **Project Overview**
    This is a Goal Tracking/Task Manager application developed for the IFN636 Software Life Cycle Management assessment. It allows users to efficiently manage their tasks and responsibilities through a secure, user-friendly interface web page.
## **URL:** http://13.211.219.232:3000

## **Key Features (align with CRUD operations)**
    The application includes the following core features:
    - User Authentication (Signup, Login, Logout)
    - Profile Management (Update personal information e.g., username, email, phone no.)
    - Task Management (Add, View, Update, and Delete tasks) 
    - View and track created tasks
## **Technology Stack**
    •	Frontend: React.js, Tailwind CSS
    •	Backend: Node.js, Express.js
    •	Database: Cloud MongoDB Atlas 
    •	Deployment & Hosting: AWS EC2 (Ubuntu `t3.medium`), Nginx (Reverse Proxy), PM2 (Process Manager) 
    •	CI/CD & Automation: GitHub Actions, Self-Hosted Runner
    •	Testing: Mocha, Chai, Sinon  
## **CI/CD Pipeline**
    This project utilises a Continuous Integration and Continuous Deployment (CI/CD) pipeline. Whenever new features are merged into the `main` branch, a GitHub Actions workflow (`ci.yml`file) automatically triggers to:
    1. Check out the code and set up Node.js.
    2. Install frontend and backend dependencies.
    3. Run automated backend unit tests.
    4. Restart the live server on AWS EC2 using PM2.


 

