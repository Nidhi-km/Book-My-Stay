Book My Stay 🏨
----------------
A full stack accommodation booking web application built with React.js, Spring Boot, and MySQL.

Tech Stack
----------------
Frontend: React.js, HTML, CSS, JavaScript
Backend: Java, Spring Boot, REST APIs
Database: MySQL
Tools: Maven, Git, GitHub

Features
---------------

* Browse and view available rooms
* Book accommodations seamlessly
* User registration and login
* Manage bookings (view / cancel)
* REST API integration between frontend and backend

Project Structure
------------------
Book-My-Stay/
├── backend/     → Spring Boot REST API
└── frontend/    → React.js application
Getting Started
---------------
Backend (Spring Boot)
cd backend
mvn spring-boot:run
Frontend (React.js)
cd frontend
npm install
npm start
Make sure MySQL is running and update application.properties with your DB credentials.

API Endpoints
-------------

Method      Endpoint    Description
GET           /api/    roomsGet all rooms
POST          /api/    bookingsCreate a booking
GET           /api/    bookings/{id}Get booking by ID
DELETE        /api/    bookings/{id}Cancel a booking

Author
------
Nidhi Km
Electronics & Communication Engineering Graduate
Aspiring Java Full Stack Developer
[GitHub Profile](https://github.com/Nidhi-km)

