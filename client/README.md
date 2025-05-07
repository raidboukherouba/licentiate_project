## 1. 👀 Overview
This is the frontend component of the **University Laboratory Management System**. It provides a **React-based** user interface for managing researchers, doctoral students, teams, laboratories, equipment, publications, communications, and affiliations. The system is designed to ensure structured management of research activities and academic contributions.

---

## 2. ✨ Features
- **User Authentication & Authorization**: Secure access to system functionalities.
- **Multi-language Support**: UI available in **Arabic, English, and French** using `i18next`.
- **Dashboard & Analytics**: Provide insights into research teams, laboratories, and scientific productions.
- **Researcher & Doctoral Student Management**: Add, edit, delete, and view researcher and doctoral student details.
- **Team & Function Management**: Organize research teams and assign roles.
- **Laboratory & Equipment Management**: Track laboratory details and inventory.
- **Publication & Communication Management**: Manage research publications and communications.
- **Affiliation & Supervision Tracking**: Monitor researcher affiliations and supervision relationships.
- **Excel Export**: Download research data in Excel format.
- **Modern UI Components**: Built with `Shadcn/ui(Radix UI)` and `Tailwind CSS` for a sleek and accessible user experience.

---

## 3. 🔧 Technologies Used
- **Frontend Framework**: `React` (v19)
- **State Management**: `react-hook-form` & `zod` for form handling and validation
- **Internationalization**: `i18next`, `react-i18next`, and `i18next-browser-languagedetector`
- **Routing**: `react-router-dom`
- **UI Components**: `Shadcn/ui(Radix UI)`, `lucide-react`, and `tailwindcss`
- **HTTP Client**: `axios`
- **Date Handling**: `date-fns`
- **Client-side Form Validation**: `@hookform/resolvers` with `zod`
- **Toasts & Notifications**: `sonner`
- **Dark Mode Support**: `next-themes`
- **Utility Libraries**: `clsx`, `lodash.debounce`, `class-variance-authority`

---

## 4. 🚀 Getting Started

### 4.1. ✅ Prerequisites
- Node.js (v22.12.0 or higher)
- npm (Node Package Manager)

### 4.2. ⬇️ Installation
1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```
5. Preview the production build:
   ```bash
   npm run preview
   ```

---

## 5. 📂 Project Structure
```
client/
│── node_modules/     # Project dependencies
│── public/           # Static assets
│── src/              # Source code
│   ├── assets/       # Images, fonts, and static files
│   ├── components/   # Reusable UI components
│   ├── context/      # React context for global state
│   ├── hooks/        # Custom React hooks
│   ├── i18n/         # Language translations
│   ├── lib/          # Utility functions and helpers
│   ├── pages/        # Application pages
│   ├── services/     # API services and data fetching
│   ├── validations/  # Form validation schemas
│   ├── App.tsx       # Main application component
│   ├── index.css     # Global styles
│   ├── main.tsx      # Main application entry point
│── package.json      # Project dependencies & scripts
│── tsconfig.json     # TypeScript configuration
│── vite.config.ts    # Vite configuration
```

---

## 6. 🔐 Environment Variables
Create a `.env` file in the `client` directory and configure:
```
VITE_API_BASE_URL=http://localhost:5000/api
```
Adjust the `VITE_API_BASE_URL` to match your backend server URL.

---

## 7. 🤝 Contributing
If you wish to contribute to this project, please follow these steps:
1. Fork the repository.
2. Create a new branch (`feature/your-feature-name`).
3. Commit your changes with clear messages.
4. Push your branch and create a Pull Request.

---

## 8. 🛠️ Development Tools
- **TypeScript**: Ensures type safety across the project.
- **Vite**: Fast build tool for modern web projects.

---

## 9. 📜 License
This project is licensed under the **MIT License**.

