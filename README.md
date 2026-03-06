# 🍔 Food Delivery Backend API

> A robust, scalable, and secure backend API for a Food Delivery application built with NestJS, TypeORM, and relational databases.

## 🌟 Features

- **Authentication System:** Secure user registration and login using JWT (JSON Web Tokens).
- **Email Verification:** OTP-based email verification using `nodemailer`.
- **Password Management:** Secure password hashing with `bcrypt` along with an integrated "Forgot Password" & "Reset Password" flow.
- **RESTful Architecture:** Follows REST principles for scalable and maintainable API endpoints.
- **Modular Design:** Built with NestJS's modular architecture for clean separation of concerns.

## 🚀 Tech Stack

- **Framework:** [NestJS](https://nestjs.com/)
- **Language:** TypeScript
- **Database ORM:** [TypeORM](https://typeorm.io/)
- **Authentication:** Passport, JWT (`@nestjs/jwt`)
- **Email Service:** Nodemailer
- **Security:** `bcrypt` (Password Hashing)

## 📦 Prerequisites

Before running this project, ensure you have the following installed:

- Node.js (v16.x or later)
- npm or yarn
- Supported Database (PostgreSQL/MySQL)

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository_url>
   cd food_delivery_backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env` file in the root directory and add your configuration (adjust properties according to your setup):

   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=your_db_username
   DB_PASSWORD=your_db_password
   DB_DATABASE=food_delivery_db

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRES_IN=1h

   # Email Configuration (Nodemailer)
   MAIL_HOST=smtp.gmail.com
   MAIL_PORT=587
   MAIL_USER=your_email@gmail.com
   MAIL_PASS=your_email_app_password
   MAIL_FROM=noreply@fooddelivery.com
   ```

## 🚗 Running the App

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## 📚 API Reference

### Authentication (`/auth`)

| Method | Endpoint                | Description                                | Request Payload                    |
| ------ | ----------------------- | ------------------------------------------ | ---------------------------------- |
| `POST` | `/auth/register`        | Register a new user & trigger OTP email    | `{ name, email, phone, password }` |
| `POST` | `/auth/verify-otp`      | Verify the OTP sent to email               | `{ email, otp }`                   |
| `POST` | `/auth/login`           | Login user and receive a JWT access token  | `{ email, password }`              |
| `POST` | `/auth/forgot-password` | Send a password reset link to user email   | `{ email }`                        |
| `POST` | `/auth/reset-password`  | Set new password using the generated token | `{ token, newPassword }`           |

_(More routes will be added organically as the project expands)_

## 🧪 Testing

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is [MIT](https://choosealicense.com/licenses/mit/) licensed.
