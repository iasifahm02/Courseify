# Courseify Backend Application
Courseify is a backend application built with Node.js and Express.js that manages course data and user interactions using RESTful APIs. It supports JWT authentication for admins and users, utilizes MongoDB for data storage, and provides seamless course management and secure user access.

## Table of Contents

- [Features](#features)
- [Setup](#setup)
- [API Usage](#api-usage)
  - [Admin Routes](#admin-routes)
  - [User Routes](#user-routes)
- [Data Models](#data-models)
- [Contributing](#contributing)
- [Contact](#contact)

## Features

- **Admin Functionality:**
  - Register and authenticate admins
  - Create, update, delete courses

- **User Functionality:**
  - Register and authenticate users
  - View available courses
  - Purchase courses

## Setup

To run this project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/iasifahm02/Courseify.git
   cd './courseify backend/'

2. **Install dependencies:**
   ```bash
   npm install

3. **Set up environment variables:**

   Create a .env file in the root directory with the following variables:
   ```plaintext
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret

4. **Run the server:**
   ```bash
   nodemon index.js

5. **Access the application:**

   Navigate to `http://localhost:3000` in your browser.



## API Usage

### Admin Routes:

- **POST /admin/signup**
  - Description: Creates a new admin account.
  - Input: `{ "username": "admin", "password": "pass" }`
  - Output: `{ "message": "Admin created successfully", "token": "jwt_token_here" }`

- **POST /admin/login**
  - Description: Authenticates an admin. Requires username and password in headers.
  - Headers: `{ "username": "admin", "password": "pass" }`
  - Output: `{ "message": "Logged in successfully", "token": "jwt_token_here" }`

- **POST /admin/courses**
  - Description: Creates a new course.
  - Headers: `{ "Authorization": "Bearer jwt_token_here" }`
  - Body: `{ "title": "course title", "description": "course description", "price": 100, "imageLink": "https://linktoimage.com", "published": true }`
  - Output: `{ "message": "Course created successfully", "courseId": 1 }`

- **PUT /admin/courses/:courseId**
  - Description: Edits an existing course.
  - Headers: `{ "Authorization": "Bearer jwt_token_here" }`
  - Body: `{ "title": "updated course title", "description": "updated course description", "price": 100, "imageLink": "https://updatedlinktoimage.com", "published": false }`
  - Output: `{ "message": "Course updated successfully" }`

- **GET /admin/courses**
  - Description: Retrieves all courses.
  - Headers: `{ "Authorization": "Bearer jwt_token_here" }`
  - Output: `{ "courses": [ { "id": 1, "title": "course title", "description": "course description", "price": 100, "imageLink": "https://linktoimage.com", "published": true }, ... ] }`

### User Routes:

- **POST /users/signup**
  - Description: Creates a new user account.
  - Input: `{ "username": "user", "password": "pass" }`
  - Output: `{ "message": "User created successfully", "token": "jwt_token_here" }`

- **POST /users/login**
  - Description: Authenticates a user. Requires username and password in headers.
  - Headers: `{ "username": "user", "password": "pass" }`
  - Output: `{ "message": "Logged in successfully", "token": "jwt_token_here" }`

- **GET /users/courses**
  - Description: Lists all available courses.
  - Headers: `{ "Authorization": "Bearer jwt_token_here" }`
  - Output: `{ "courses": [ { "id": 1, "title": "course title", "description": "course description", "price": 100, "imageLink": "https://linktoimage.com", "published": true }, ... ] }`

- **POST /users/courses/:courseId**
  - Description: Purchases a course by ID.
  - Headers: `{ "Authorization": "Bearer jwt_token_here" }`
  - Output: `{ "message": "Course purchased successfully" }`

- **GET /users/purchasedCourses**
  - Description: Retrieves all courses purchased by the user.
  - Headers: `{ "Authorization": "Bearer jwt_token_here" }`
  - Output: `{ "purchasedCourses": [ { "id": 1, "title": "course title", "description": "course description", "price": 100, "imageLink": "https://linktoimage.com", "published": true }, ... ] }`

## Data Models

The MongoDB data model includes collections for Admins, Users, and Courses. Here is a simplified view of the data structure:

### Admin Data:
    {
      "_id": {"$oid": "6530e0adbab88d35bcd48040"},
      "username": "iasifahm@gmail.com",
      "password": "123456"
    }

### User Data:
    {
      "_id": {"$oid": "6530eee9597d4d723c79b999"},
      "username": "asifsays@gmail.com",
      "password": "123456",
      "purchasedCourses": [
        {"$oid": "6530e398ca982cd9516b019a"},
        {"$oid": "6530e33aca982cd9516b0198"}
      ]
    }

### Course Data:
    {
      "_id": {"$oid": "6530e398ca982cd9516b019a"},
      "title": "A2Z DSA Sheet challenge",
      "description": "100 days DSA challenge by Striver",
      "price": 0,
      "imageLink": "https://d33g7sdvsfd029.cloudfront.net/subject/2023-01-17-0.3698267942851394.jpg",
      "published": true
    }


## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a pull request.


## Contact

For any inquiries or collaborations, feel free to reach out via [email](iasif.ahm02@gmail.com) or connect on [LinkedIn](https://www.linkedin.com/in/asifahm/) & [Twitter](https://x.com/aaasifsays).



