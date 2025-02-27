# Task Management System App with MERN

A comprehensive task management system built with the MEAN (MongoDB, Express.js, ReactJS, Node.js) stack.

## Getting Started

### Prerequisites

* Node.js (20 or later)
* npm (10 or later)
* MongoDB (local or MongoDB Atlas)

### Installation

1. Clone the repository using `git clone <repository-url>`
2. Navigate to the project directory using `cd tms-mean`
3. Install dependencies using `npm install`

### Configuration

Create a `.env` file in the project root with the following variables:

```makefile
PORT=8081
NODE_ENV=development
JWT_SECRET=
MONGO_LOCAL_URI=mongodb://127.0.0.1:27017/xyz
CONNECTION_STRING=

#Run App

npm run dev

###API Endpoints
Authentication
User Register: POST http://localhost:8081/api/v1/auth/user/register
User Login: POST http://localhost:8081/api/v1/auth/user/login
##Task Management
Create Task: POST http://localhost:8081/api/v1/task
Get Tasks: GET http://localhost:8081/api/v1/task
Update Task: PATCH http://localhost:8081/api/v1/task/:taskId
Delete Task: DELETE http://localhost:8081/api/v1/task/:taskId
Get All Tasks: GET http://localhost:8081/api/v1/task/all-tasks
