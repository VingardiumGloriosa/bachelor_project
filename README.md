# **Strength in Simplicity: Weightlifting App for Program Management & Progress Monitoring**

This project is a mobile application designed to streamline the management of weightlifting training programs and progress tracking for **IK99**, a weightlifting club in Copenhagen. It integrates training program distribution, workout logging, and progress visualization into a single, user-friendly platform.

---

## **Project Overview**

The app focuses on:

- Efficient training program management
- Seamless progress monitoring
- Offline and real-time functionality for enhanced usability

---

## **Technologies Used**

### **Frontend**

- **Frameworks:** Vue.js, Vuetify
- **State Management:** Pinia
- **Router:** Vue Router
- **Development Tools:** TypeScript, Storybook

### **Backend**

- **Platform:** Supabase (Authentication, Database, Real-time Sync)
- **Database:** PostgreSQL

### **Progressive Web App (PWA)**

- Offline access and app-like experience with PWA capabilities

### **Testing and Quality**

- **Unit Testing:** Vitest
- **Code Quality:** ESLint
- **Data Visualization:** Chart.js

---

## **Recommended IDE Setup**

To streamline development and debugging:

1. Use **VSCode** as the IDE.
2. Install **Volar** and disable Vetur for optimal Vue development.
3. Configure TypeScript support for `.vue` imports:
   - Utilize the `vue-tsc` tool for type checking.

---

## **Installation & Setup**

### **Clone the Repository**

```bash
git clone https://github.com/vingardium_gloriosa/bachelor_project.git
cd bachelor_project
```

### **Install Dependencies**

```bash
npm install
```

---

## **Running the Development Server**

To start the application with hot reload for local development:

```bash
npm run dev
```

---

## **Build for Production**

To compile and optimize the app for production deployment:

```bash
npm run build
```

---

## **Testing**

Run unit tests implemented with Vitest:

```bash
npx run vitest
```

---

## **Project Structure**

This project follows a modular and scalable structure:

1. **Frontend Code**
   - Vue.js components for user interfaces
   - Pinia for state management
   - Vue Router for navigation
2. **Backend Code**
   - Supabase for authentication and real-time database functionality
3. **Testing**
   - Vitest for unit testing
   - ESLint for maintaining code quality

---

## **Key Features**

- **User Authentication:** Password-free OTP-based login via Supabase.
- **Workout Tracking:** Athletes can log sessions, track progress, and visualize performance.
- **PWA Support:** Enables offline functionality and an app-like mobile experience.
- **Real-Time Syncing:** Changes to data or training programs are instantly updated, powered by Supabase.

## **License**

This project is licensed under [MIT License](LICENSE). Contributions are welcome!
