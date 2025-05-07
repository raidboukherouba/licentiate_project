## 1. 👀 Overview
This is the server-side component of the University Laboratory Management System. It provides RESTful APIs for managing researchers, doctoral students, teams, laboratories, equipment, publications, communications, and affiliations. The system ensures structured management of research activities, inventory, and academic contributions.

---

## 2. ✨ Features
- **Researcher & Doctoral Student Management**: Add, update, delete, and retrieve researcher and doctoral student details, including personal and academic information.
- **Team & Function Management**: Manage research teams and their roles.
- **Laboratory & Equipment Management**: Handle laboratory details, affiliated departments, and equipment inventory.
- **Publication & Communication Management**: Track research publications and scientific communications.
- **Affiliation & Supervision Tracking**: Manage researcher and doctoral student affiliations with laboratories and supervision records.
- **Categorization & Specialization**: Classify publications by specialty, category, and production type.
- **Validation**: Input validation using Joi for data integrity.
- **Error Handling**: Robust error handling for database operations and API requests.
- **Excel Export**: Export data for researchers, laboratories, doctoral students, supervisions, equipment, teams, and scientific productions in Excel format.

---

## 3. 🔧 Technologies Used
- **Backend Framework**: `Node.js` with `Express.js` 
- **Database**: `PostgreSQL` (using Sequelize ORM) 
- **Validation**: `Joi` 
- **Environment Variables**: `dotenv` 
- **Internationalization**: `i18next` (with i18next-fs-backend and i18next-http-middleware for handling Arabic, English, and French translations)
- **Compression**: `compression` middleware (for gzip compression of HTTP responses) 
- **Security**: 
   - `helmet` (for setting secure HTTP headers) 
   - `express-rate-limit` (to prevent abuse and control API request rates)
   - `passport` and `passport-local` (for local authentication strategies)
   - `express-session` (for session management)
- **CORS Handling**: `cors` (for enabling Cross-Origin Resource Sharing) 
- **HTTP Status Codes**: `http-status-codes` (for standardized HTTP response codes) 
- **Database Driver**: `pg` (for PostgreSQL connectivity) 
- **CLI & Migrations**: `sequelize-cli` (for database migrations and management) 
- **Development & Monitoring**: `nodemon` (for automatic server restarts on file changes)
- **Excel Export**: `exceljs` (for generating and exporting Excel files)
- **Password Hashing**: `bcrypt` (for securely hashing passwords)

---

## 4. 🚀 Getting Started

### 4.1. ✅ Prerequisites
- Node.js (v22.12.0 or higher)
- PostgreSQL
- npm (Node Package Manager)

### 4.2. ⬇️ Installation
1. Navigate to the `server` directory:

   ```bash
   cd server
2. Install dependencies:

   ```bash
   npm install
3. Run database creation:

   ```bash
   npx sequelize-cli db:create
4. Run database migrations:

   ```bash
   npx sequelize-cli db:migrate
5. Seed the database:

   ```bash
   npx sequelize-cli db:seed:all
6. Start the server:

    ```bash
    npm run dev
