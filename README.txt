VEHICLE MANAGEMENT SYSTEM - COMPLETE PROJECT

STACK
- Java 17
- Spring Boot 3.3.5
- Spring Data JPA
- MySQL
- HTML/CSS/JavaScript
- IntelliJ IDEA
- Maven

IMPORTANT
You enter vehicles, customers, bookings and payments from the WEBSITE.
The website calls Spring Boot REST APIs.
Spring Boot saves the information in MySQL.
You do not need to manually insert normal records into MySQL.

RUN BACKEND
1. Install Java 17 and IntelliJ IDEA.
2. Start MySQL in XAMPP (or your MySQL service).
3. Open the backend folder in IntelliJ as a Maven project.
4. Wait for Maven dependencies to download.
5. Open:
   src/main/resources/application.properties
6. Default configuration assumes:
   username = root
   password = empty
   database = vehicle_management
   port = 3306
   server = 8080
   If your MySQL root password is not empty, change spring.datasource.password.
7. Run VehicleManagementApplication.java.
8. Wait for Spring Boot to say it started on port 8080.

RUN FRONTEND
Option A (simple):
- Open frontend/index.html in a browser after the backend is running.
- If the browser blocks requests from file://, use Option B.

Option B (recommended):
- In IntelliJ install/use a simple local server extension, or use Python if installed:
  python -m http.server 5500
  Run it from the frontend folder.
- Open http://localhost:5500

WEBSITE
Dashboard
Vehicles
Customers
Bookings
Payments

The forms perform Add, Update and Delete through the REST API.

API ENDPOINTS
GET/POST  /api/vehicles
GET/PUT/DELETE /api/vehicles/{id}

GET/POST  /api/customers
GET/PUT/DELETE /api/customers/{id}

GET/POST  /api/bookings
GET/PUT/DELETE /api/bookings/{id}

GET/POST  /api/payments
GET/PUT/DELETE /api/payments/{id}

PRESENTATION FLOW
1. Start MySQL.
2. Run Spring Boot.
3. Open the website.
4. Show Dashboard.
5. Add a vehicle from the website.
6. Refresh/show the vehicle list.
7. Edit the vehicle from the website.
8. Delete it if desired.
9. Explain:
   Website -> REST API -> Service -> Repository -> MySQL
