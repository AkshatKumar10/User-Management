# User-Management

This is a React application built with Vite that integrates with the Reqres API to perform basic user management functions, including authentication, user listing, editing, and deletion.

## Getting Started

1. Clone the Repository
```bash
git clone https://github.com/your-username/User-Management.git
cd User-Management
```

2. Install Dependencies
Using npm:
```bash
npm install
```

3. Run the Development Server
Start the application in development mode:
```bash
npm run dev
```

## Login Credentials
Since this project uses the Reqres API, you can log in with the following test credentials:

- **Email**: eve.holt@reqres.in

- **Password**: cityslicka

If authentication is successful, the API returns a token, which can be used for subsequent requests.

## API Integration (Reqres API)
This project interacts with the Reqres API for user management. API endpoints used:

- **Authentication**: POST /api/login

- **Fetch Users**: GET /api/users

- **Edit User**: PUT /api/users/:id

- **Delete User**: DELETE /api/users/:id

## Assumptions & Considerations
- Authentication is simulated using Reqres API, which accepts predefined credentials.

- Users are fetched and managed via the Reqres API, but changes are not persistent (since it's a mock API).

- Vite is used for better performance and fast builds.
