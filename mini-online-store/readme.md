🏪 Mini Online Store API

A simple Express.js project demonstrating MVC architecture, middleware, and REST API development.

---

🚀 Setup

npm init -y
npm install express
npm install -D nodemon

Run server:

npm start
# or
npm run dev

Server:

http://localhost:3000

---

📁 Structure

mini-online-store-api/
├── app.js
├── routes/
├── controllers/
└── middleware/

---

🔗 API Endpoints

Products

- GET /products
- GET /products/:id

Users (Protected)

Header:

Authorization: Bearer my-secret-token-123

- GET /users/:id
- POST /users

---

🧪 Testing

curl http://localhost:3000/products

curl -H "Authorization: Bearer my-secret-token-123" \
http://localhost:3000/users/1

curl -X POST http://localhost:3000/users \
-H "Authorization: Bearer my-secret-token-123" \
-H "Content-Type: application/json" \
-d '{"name":"Ali","email":"ali@example.com"}'

---

⚠️ Errors

- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 409 Conflict

---

💡 Concepts

- MVC Architecture
- Middleware
- Express Router
- REST API

---

⭐ For academic use
