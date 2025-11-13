🏡 RealReview – Location-Verified Real Estate Image & Rating Platform

A full-stack real estate photo review system where users upload property/location images, rate them, and explore verified reviews from real people in the city.

Helping newcomers explore areas, schools, facilities, and neighborhood conditions using verified pictures & ratings.

🚀 Features
👤 User Features

Upload real estate images with auto-detected location using Google Geocoding API

View all approved images on the Home feed

Rate any public image

Manage your uploads via My Photos

JWT-based Authentication (Login, Register, Protected Routes)

🛡️ Admin Features

Dedicated Admin Role using Spring Security

Approve / Reject images submitted by users

Only approved images become public

Manage reported or low-rated photos

📍 Location Intelligence

Auto-validates uploaded image’s location

Prevents fake/incorrect location submissions

Stores latitude & longitude

Supports future analytics

🗄️ Image Metadata Stored

Uploaded By (User)

Uploaded At (Timestamp)

Location (Address)

Coordinates (Latitude/Longitude)

Average Rating

Total Ratings

🏗️ Tech Stack
Backend

Java 17

Spring Boot 3

Spring Security + JWT

PostgreSQL

JPA / Hibernate

Google Geocoding API

Frontend

React 18

Axios

React Router DOM

Custom CSS-based UI

Deployment

AWS EC2 / S3 (optional)

Local storage for images during development

📦 Folder Structure
backend/
 └── src/main/java/com/realreview
       ├── controller
       ├── service
       ├── repository
       ├── entity
       ├── security (JWT)
       └── RealReviewApplication.java

frontend/
 └── src/
      ├── components/
      ├── pages/
      ├── api.js
      ├── AuthContext.js
      ├── App.js
      └── index.js

🖼️ Screenshots

Add your screenshots here:

Login Page

Register Page

Home Feed

Upload Image

Admin Dashboard

🧪 API Endpoints (Quick Overview)
🔐 Auth
Method	Endpoint	Description
POST	/api/auth/register	Register user
POST	/api/auth/login	Login & JWT response
GET	/api/auth/me	Get logged-in user
🖼️ Images
Method	Endpoint	Role	Description
POST	/api/images/upload	User	Upload new image
GET	/api/images/approved	Public	View approved public images
GET	/api/images/my	User	View user’s images
POST	/api/images/{id}/rate	User	Rate an image
🛡️ Admin
Method	Endpoint	Description
GET	/api/admin/pending	View pending approval list
POST	/api/admin/approve/{id}	Approve image
POST	/api/admin/reject/{id}	Reject image
🛠️ Setup Instructions
Backend Setup
cd backend
mvn spring-boot:run

Frontend Setup
cd frontend
npm install
npm start

Environment Variables

Create .env:

GOOGLE_API_KEY=YOUR_API_KEY_HERE

📄 License

This project is created for educational and internship evaluation purposes only.
