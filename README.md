# SynergySphere – Advanced Team Collaboration Platform

## Overview
SynergySphere is a foundational team collaboration platform designed to streamline task management, communication, and project oversight. It aims to provide a central nervous system for teams, helping them stay organized, communicate effectively, and track progress efficiently. This MVP (Minimum Viable Product) version focuses on core functionalities accessible via both desktop and mobile interfaces.

## Features
-   **User Authentication:** Secure user registration and login with JWT (JSON Web Tokens).
-   **Project Management:** Create, view, and manage multiple projects.
-   **Task Tracking:** Assign tasks with due dates and statuses (To-Do, In Progress, Done).
-   **Intuitive Task Board:** Visualize task progress using a Kanban-style board with drag-and-drop functionality.
-   **Project Discussions:** Engage in threaded discussions specific to each project.
-   **Password Reset:** Secure password recovery via email.

## Technologies Used
-   **Frontend:** HTML5, CSS3, JavaScript (Vanilla JS)
-   **Styling:** Bootstrap 5
-   **Backend:** Node.js, Express.js
-   **Database:** PostgreSQL
-   **Authentication:** `bcryptjs` (for password hashing), `jsonwebtoken` (for JWTs)
-   **Email Service:** `nodemailer` (for password reset emails)
-   **Environment Variables:** `dotenv`
-   **Drag-and-Drop:** `SortableJS`

## Setup Instructions

### Prerequisites
Before you begin, ensure you have the following installed on your system:
-   [Node.js](https://nodejs.org/en/download/) (LTS version recommended)
-   [PostgreSQL](https://www.postgresql.org/download/)

### 1. Clone the Repository (or download the project files)
```bash
# If you are using Git
git clone <repository_url>
cd synergysphere
```
If you downloaded the project files, navigate to the `synergysphere` directory.

### 2. Install Dependencies
Navigate to the project root directory in your terminal and install the required Node.js packages:
```bash
npm install
```

### 3. Database Setup
a.  **Create PostgreSQL Database:**
    Open your PostgreSQL client (e.g., `psql` or pgAdmin) and create a new database:
    ```sql
    CREATE DATABASE synergysphere;
    ```
b.  **Run Schema Migrations:**
    Connect to the `synergysphere` database and execute the SQL commands from the `database.sql` file located in your project root. This will create all necessary tables:
    ```bash
    # Example using psql
    psql -U your_postgres_user -d synergysphere -f database.sql
    ```
    (Replace `your_postgres_user` with your PostgreSQL username)

### 4. Environment Configuration
Create a `.env` file in the root of your project directory (`synergysphere/.env`). This file will store your sensitive credentials.

```
# SMTP (Email Service) Configuration - for password reset
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your_brevo_smtp_user # e.g., 9669af001@smtp-brevo.com
SMTP_PASSWORD=your_brevo_smtp_password # Your Brevo SMTP Key

# Database Configuration
DB_USER=postgres
DB_HOST=localhost
DB_NAME=synergysphere
DB_PASSWORD=your_postgres_password # IMPORTANT: Replace with your actual PostgreSQL password
DB_PORT=5432

# JWT Secret (for user authentication)
# IMPORTANT: Change this to a strong, random string in production
JWT_SECRET=your_jwt_secret
```
**Important:** Replace the placeholder values (`your_brevo_smtp_user`, `your_brevo_smtp_password`, `your_postgres_password`, `your_jwt_secret`) with your actual credentials.

## Usage

### Start the Server
From the project root directory, run the development server:
```bash
npm run dev
```
This will start the server using `nodemon`, which automatically restarts on file changes.

### Access the Application
Open your web browser and navigate to:
```
http://localhost:3000
```

## Demo Walkthrough (Example Scenario)
You can follow a demo scenario to showcase the features:
1.  **Sign Up:** Create new user accounts (e.g., `alice@example.com`, `bob@example.com`, `charlie@example.com`).
2.  **Login:** Log in as a project manager (e.g., `alice@example.com`).
3.  **Create Projects:** Add new projects like "SynergySphere 1.0 Development".
4.  **Add Tasks:** Populate projects with tasks, assigning them to different users and setting due dates.
5.  **Update Task Status:** Use the drag-and-drop functionality to move tasks between "To-Do", "In Progress", and "Done" columns.
6.  **Communicate:** Add comments to project discussion threads.
7.  **Test Password Reset:** Use the "Forgot Password" feature to demonstrate email-based password recovery.

---
