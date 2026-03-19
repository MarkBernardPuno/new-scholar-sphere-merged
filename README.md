# Scholar Sphere CRUD API

A comprehensive CRUD API built with FastAPI and PostgreSQL for managing user registration, authentication, and related entities.

## Features

- ✅ Complete CRUD operations for all entities
- ✅ RESTful API design
- ✅ PostgreSQL database with relationships
- ✅ Pydantic validation schemas
- ✅ SQLAlchemy ORM models
- ✅ Interactive API documentation (Swagger UI)
- ✅ Error handling and validation
- ✅ Pagination support

## Database Schema

### Tables

1. **Colleges** - Store college information
   - college_id (PK)
   - college_name
   - college_campus

2. **Departments** - Store department information
   - dept_id (PK)
   - dept_name

3. **Roles** - Store user roles
   - role_id (PK)
   - role_name

4. **Campuses** - Store campus information
   - campus_id (PK)
   - campus_name

5. **Registrations** - Store user registration data
   - user_id (PK)
   - full_name
   - email
   - password
   - college_id (FK)
   - dept_id (FK)
   - role_id (FK)
   - campus_id (FK)
   - created_at

6. **Logins** - Store login records
   - login_id (PK)
   - user_id (FK)
   - password
   - last_login

## Installation

### Prerequisites

- Python 3.9+
- PostgreSQL 12+
- pip (Python package manager)

### Setup Steps

1. **Clone the repository**
   ```bash
   cd /workspaces/new-scholar-sphere
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and update the database connection string:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/scholar_db
   ```

5. **Create PostgreSQL database**
   ```bash
   createdb scholar_db
   ```

6. **Run the application**
   ```bash
   python -m uvicorn app.main:app --reload
   ```

The API will be available at `http://localhost:8000`

## API Endpoints

### College Endpoints
- `POST /colleges/` - Create a college
- `GET /colleges/` - Get all colleges
- `GET /colleges/{college_id}` - Get a specific college
- `PUT /colleges/{college_id}` - Update a college
- `DELETE /colleges/{college_id}` - Delete a college

### Department Endpoints
- `POST /departments/` - Create a department
- `GET /departments/` - Get all departments
- `GET /departments/{dept_id}` - Get a specific department
- `PUT /departments/{dept_id}` - Update a department
- `DELETE /departments/{dept_id}` - Delete a department

### Role Endpoints
- `POST /roles/` - Create a role
- `GET /roles/` - Get all roles
- `GET /roles/{role_id}` - Get a specific role
- `PUT /roles/{role_id}` - Update a role
- `DELETE /roles/{role_id}` - Delete a role

### Campus Endpoints
- `POST /campuses/` - Create a campus
- `GET /campuses/` - Get all campuses
- `GET /campuses/{campus_id}` - Get a specific campus
- `PUT /campuses/{campus_id}` - Update a campus
- `DELETE /campuses/{campus_id}` - Delete a campus

### Registration Endpoints
- `POST /registrations/` - Create a user registration
- `GET /registrations/` - Get all registrations
- `GET /registrations/{user_id}` - Get a specific registration
- `PUT /registrations/{user_id}` - Update a registration
- `DELETE /registrations/{user_id}` - Delete a registration

### Login Endpoints
- `POST /logins/` - Record a login
- `GET /logins/` - Get all logins
- `GET /logins/{login_id}` - Get a specific login
- `DELETE /logins/{login_id}` - Delete a login record

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Example API Requests

### Create a College
```bash
curl -X POST "http://localhost:8000/colleges/" \
  -H "Content-Type: application/json" \
  -d '{
    "college_name": "Engineering College",
    "college_campus": "Main Campus"
  }'
```

### Create a Department
```bash
curl -X POST "http://localhost:8000/departments/" \
  -H "Content-Type: application/json" \
  -d '{
    "dept_name": "Computer Science"
  }'
```

### Create a Role
```bash
curl -X POST "http://localhost:8000/roles/" \
  -H "Content-Type: application/json" \
  -d '{
    "role_name": "Student"
  }'
```

### Create a Campus
```bash
curl -X POST "http://localhost:8000/campuses/" \
  -H "Content-Type: application/json" \
  -d '{
    "campus_name": "North Campus"
  }'
```

### Register a User
```bash
curl -X POST "http://localhost:8000/registrations/" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Doe",
    "email": "john@example.com",
    "password": "secure_password",
    "college_id": 1,
    "dept_id": 1,
    "role_id": 1,
    "campus_id": 1
  }'
```

### Record a Login
```bash
curl -X POST "http://localhost:8000/logins/" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": 1,
    "password": "secure_password"
  }'
```

## Project Structure

```
new-scholar-sphere/
├── app/
│   ├── main.py          # FastAPI application and routes
│   ├── models.py        # SQLAlchemy ORM models
│   └── schemas.py       # Pydantic validation schemas
├── database/
│   ├── database.py      # Database connection and configuration
│   └── schema.sql       # SQL schema definitions
├── requirements.txt     # Python dependencies
├── .env.example        # Environment variables template
└── README.md           # This file
```

## Technologies Used

- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - Python ORM
- **Pydantic** - Data validation
- **PostgreSQL** - Database
- **Uvicorn** - ASGI server

## Error Handling

The API returns appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `204` - No Content (Delete)
- `400` - Bad Request (Validation Error)
- `404` - Not Found
- `500` - Internal Server Error

## Notes

- All timestamps are in UTC
- Email validation is enforced
- Unique constraints on full_name and email in registrations
- Foreign key relationships ensure referential integrity
- Pagination is supported with `skip` and `limit` parameters

## Future Enhancements

- Password hashing and authentication
- JWT token-based authentication
- Rate limiting
- API versioning
- Comprehensive logging
- Database migrations with Alembic
- Unit and integration tests

## License

MIT License

## Support

For issues or questions, please contact the development team.