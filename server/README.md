# Task Management System App with MEAN

A comprehensive task management system built with the MEAN (MongoDB, Express.js, Angular, Node.js) stack.

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
JWT_SECRET=dcfd87a3b40a47fb9f117d5284871ab930fd419f090366f6b9258982f17e82ca
MONGO_LOCAL_URI=mongodb://127.0.0.1:27017/xyz
CONNECTION_STRING=mongodb+srv://admin:xyz@cluster0.djum21d.mongodb.net/xyz?retryWrites=true&w=majority&appName=Cluster0

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