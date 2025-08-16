# 🛒 E-commerce API  

## 📖 Overview  
This project is a **RESTful E-commerce API** that provides core functionality for an online store.  
It allows users to:  
- Create accounts and authenticate securely.  
- Browse products, categories, brands, and reviews.  
- Manage shopping carts, apply coupons, and place orders.  
- Maintain personal wishlist and addresses.  
- Admins can manage users, products, categories, coupons, and orders.  

The API is designed with **scalability and security in mind**, making it suitable for real-world e-commerce applications.  

---

## ✨ Features  
- 🔐 User Authentication & Authorization (JWT-based)  
- 🛍️ Product, Category & Brand Management  
- 🛒 Shopping Cart with Coupons  
- 📦 Order Management (Cash Orders)  
- ❤️ Wishlist & Addresses  
- ⭐ Reviews & Ratings  
- 📸 Image Uploads
- 📚 API Documentation with Swagger  


## 🛠️ Tech Stack  

- **Backend Framework:** Node.js + Express.js  
- **Database:** MongoDB + Mongoose ODM  
- **Authentication & Security:**  
  - JSON Web Tokens (JWT)  
  - Bcrypt (password hashing)  
- **Image/File Uploads:** Multer 
- **Payment & Orders:** Cash Orders (Stripe/PayPal support will be added soon)  
- **Other Tools:**  
  - Nodemailer (reset password emails)  
  - dotenv (environment configuration)  
  - Morgan (logging requests)  

---

## ⚙️ Installation & Running Locally  

### 1. Clone the repository   
git clone https://github.com/OsamaShaker0/E-commerceAPI.git

### 2. Install dependencies
npm install 

### 3.  Create .env file
Inside the project root, create a .env file and add the following variables:

PORT = You port 

DB_STRING = your db connection string

JWT_SECRET = your jwt secret 

JWT_EXPIRES_IN = your expired date

EMAIL_AUTH_USER = Your application gmail 
EMAIL_AUTH_PASSWORD =Your application gmail generated passcode

### 4. Run the server
node server.js

### 5.API Base URL

Local: http://localhost:yourport/api/v1/signup

Production: (link will bw added after deploy )

### 6.API Documentation

Local: http://localhost:your-port/api/v1/docs

Production: (link will bw added after deploy )

