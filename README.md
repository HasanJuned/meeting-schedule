# **Meeting Scheduler App Backend**

This is the **backend repository** for the Meeting Scheduler project developed by Team *confused_coders*. It provides the core functionality required to handle user authentication, time slot management, booking logic, and notifications, supporting the Meeting Scheduler's frontend application.

---

### **Setup Steps**

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/HasanJuned/meeting-schedule
   ```
   ```bash
   cd meeting-schedule
   ```
   ```bash
   npm install
   ```
   ```bash
   PORT=2024
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```
   ```bash
   npm start
   ```

   ---

 ### **Prerequisites**
- Node.js (v16 or above)
- MongoDB (local or cloud instance)
 
---

## **Tech Stack**

- **Backend Framework:** Node.js (Express.js)
- **Database:** MongoDB
- **Authentication:** JWT (JSON Web Tokens)
- **Timezone Handling:** Moment.js / Luxon
- **Architecture:** MVC (Model-View-Controller)

---

## **Features**

### **1. User Authentication**
- Secure registration and login using JWT.
- Role-based access control:
  - **Host:** Create, manage, and delete time slots.
  - **Guest:** Search and book time slots.

### **2. Time Slot Management**
- Hosts can:
  - Create one-time or recurring time slots.
  - Edit or delete slots.
  - View booking statuses (booked, available, or canceled).
- Guests can:
  - View available slots.
  - Book time slots from multiple Hosts.

### **3. Advanced Slot Booking Algorithm**
- Detects and resolves booking conflicts using a priority-based algorithm.
- Avoids overlapping or double bookings intelligently.

### **4. Timezone and Localization**
- Implements timezone conversions to support users across different time zones.
- Displays meeting times in the user's local time.

### **5. Push Notifications**
- Real-time notifications for:
  - Booking confirmations.
  - Meeting reminders.
  - Cancellations or updates.

### **6. API Integration**
- RESTful API endpoints for seamless communication with the frontend.
- Detailed documentation for each API endpoint.

---

## **API Endpoints**

### **User Authentication**
### **Host Routes**
### Auth:
| Method | Endpoint                          | Description                         | Middleware                  |
|--------|-----------------------------------|-------------------------------------|-----------------------------|
| POST   | `/host/registration`              | Register a new Host                 | None                        |
| POST   | `/host/login`                     | Host login                          | None                        |
| POST   | `/host/profile`                   | View or update Host profile         | `HostAuthVerifyMiddleware`  |

---

### Other:
| Method | Endpoint                                   | Description                                   | Middleware                |
|--------|-------------------------------------------|-----------------------------------------------|---------------------------|
| POST   | `/host/createschedule`                    | Create a schedule                            | `HostAuthVerifyMiddleware` |
| POST   | `/host/edit/:scheduleId`                  | Edit an existing schedule                    | `HostAuthVerifyMiddleware` |
| GET    | `/host/delete/:hostEmail/:scheduleId`     | Delete a schedule                            | `HostAuthVerifyMiddleware` |
| GET    | `/host/mostBooked/:hostEmail`             | Get the most booked schedules                | `HostAuthVerifyMiddleware` |
| GET    | `/host/popularBookingTime/:hostEmail`     | Get the most popular booking times           | `HostAuthVerifyMiddleware` |
| GET    | `/host/meetings/today/:hostEmail/:startDate` | Count today's meetings for a host           | `HostAuthVerifyMiddleware` |

---

### **Guest Routes**
| Method | Endpoint                                   | Description                                   | Middleware                |
|--------|-------------------------------------------|-----------------------------------------------|---------------------------|
| POST   | `/guest/registration`                     | Register a new guest                         | None                      |
| POST   | `/guest/login`                            | Guest login                                  | None                      |
| POST   | `/guest/profile`                          | View or update guest profile                 | `GuestAuthVerifyMiddleware` |
| POST   | `/guest/search`                           | Search schedules                             | None                      |
| GET    | `/guest/schedules`                        | View all schedules                           | None                      |
| GET    | `/guest/bookschedule/:scheduleId/:fullName` | Book a schedule                              | None                      |

---

