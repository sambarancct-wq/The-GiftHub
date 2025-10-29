# 🎁 GiftHub

GiftHub is a full-stack web application built using **React.js** (frontend) and **Spring Boot** (backend) that simplifies event gifting.  
Users can join an event through an email invitation, view what gifts other guests are giving, and choose or book a **unique gift** to avoid duplicates.

---

## 🚀 Features

### 👥 User Features
- **Join Event via Email Invitation:** Guests receive a unique invitation link to join an event.
- **View Gift List:** See what gifts other participants are planning to give.
- **Book or Choose a Gift:** Select a unique gift to prevent duplication.
- **Real-Time Updates:** The gift list updates dynamically when new guests join or book gifts.
- **User Authentication:** Secure sign-up/login for both event organizers and guests.
- **Responsive UI:** Works smoothly across desktop, tablet, and mobile devices.

### 🛠️ Admin/Event Organizer Features
- **Create & Manage Events:** Create events with details like date, location, and description.
- **Send Invitations:** Invite guests through email with personalized links.
- **Monitor Gift Status:** View which guests have joined and which gifts are booked or pending.
- **Delete or Update Events:** Manage events anytime from the admin panel.

---

## 🧩 Tech Stack

### Frontend
- React.js - Component-based UI
- Axios — For API communication
- React Router DOM — For navigation
- TailwindCSS / CSS Modules — For styling

### Backend
- Spring Boot — REST API framework
- **Spring Data JPA** — ORM for database operations
- Spring Security — For authentication & authorization
- MySQL— Database
- Java Mail Sender — For sending email invitations

---

---

## ⚙️ Installation & Setup

### Prerequisites
Make sure you have installed:
- **Node.js** (v16+)
- **npm** or **yarn**
- **Java 17+**
- **Maven** (for backend)
- **MySQL / PostgreSQL** running locally or in cloud

---

### 🔧 Backend Setup (Spring Boot)

1. Navigate to the backend directory:
   ```bash
   cd backend
2.Open src/main/resources/application.properties and update database credentials:
    spring.datasource.url=jdbc:mysql://localhost:3306/gifthub
    spring.datasource.username=root
    spring.datasource.password=yourpassword
    spring.jpa.hibernate.ddl-auto=update
    spring.jpa.show-sql=true
3.Run the backend server:
    mvn spring-boot:run
4.mvn spring-boot:run
    http://localhost:8080


#💻 Frontend Setup (React)

1.Navigate to the frontend directory:
    cd frontend
2.Install dependencies:
    npm install
3.Create an .env file and define your backend API base URL:
    VITE_API_URL=http://localhost:8080
4.Run the development server:
    npm run dev
5.The frontend will be available at:
    http://localhost:5173


🧠 Future Enhancements

✅ Integration with Google Calendar for event reminders

✅ Gift price tracking and purchase links

✅ Event chat system for guests

✅ Real-time updates with WebSockets

✅ Payment gateway for group gifting

👨‍💻 Author

Sambaran Banerjee,
Manoj Nath,
Dharani Kumar,
