
# mf-timekeeper

## Overview
`mf-timekeeper` is a micro-frontend version control system designed to manage and synchronize versions across different micro-frontend architectures. This system utilizes a Rust-based API for backend operations, a Svelte frontend for user interaction, and leverages Redis for caching alongside PostgreSQL for database storage.

## Features
- **Version Management API**: A robust Rust backend that handles CRUD operations related to versioning of micro-frontends.
- **Interactive UI**: A Svelte-powered frontend providing an intuitive interface for managing versions.
- **Caching with Redis**: Enhances performance by caching frequent queries.
- **Dynamic Module Federation**: Implements module federation to dynamically load and manage micro-frontends.

## Prerequisites
To run this project, you will need:
- Rust (latest stable version)
- Node.js (v14 or later recommended)
- PostgreSQL (setup and running)
- Redis (setup and running)

## Getting Started

### Backend Setup
1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```
2. **Build the Rust project:**
   ```bash
   cargo build
   ```
3. **Run database migrations (ensure Diesel CLI is installed):**
   ```bash
   diesel migration run
   ```
4. **Start the server:**
   ```bash
   cargo run
   ```

### Frontend Setup
1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```

## API Documentation
- **POST `/api/version`**: Accepts and records a new version entry.
- **GET `/api/version`**: Retrieves the latest version details, with data possibly served from Redis cache.

## Configuration
- **Database Configuration**: Set up your PostgreSQL connection strings inside the `.env` file.
- **Redis Configuration**: Configure your Redis connection details in the `.env` file.

## Docker Deployment
Deploy `mf-timekeeper` using Docker by following these steps:
1. **Build Docker images:**
   ```bash
   docker-compose build
   ```
2. **Run the Docker containers:**
   ```bash
   docker-compose up
   ```

## Contributing
Contributions are welcome. Please fork the repository and submit pull requests with any features, fixes, or enhancements.

## License
`mf-timekeeper` is open-source software licensed under the ISC License. See the [LICENSE](LICENSE) file for more details.

## Contact
For support, feedback, or more information, please reach out to me.

---
