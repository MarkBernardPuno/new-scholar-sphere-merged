-- Create Colleges Table
CREATE TABLE IF NOT EXISTS colleges (
    college_id SERIAL PRIMARY KEY,
    college_name VARCHAR(255) NOT NULL,
    college_campus VARCHAR(255) NOT NULL
);

-- Create Departments Table
CREATE TABLE IF NOT EXISTS departments (
    dept_id SERIAL PRIMARY KEY,
    dept_name VARCHAR(255) NOT NULL
);

-- Create Roles Table
CREATE TABLE IF NOT EXISTS roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(100) NOT NULL UNIQUE
);

-- Create Campuses Table
CREATE TABLE IF NOT EXISTS campuses (
    campus_id SERIAL PRIMARY KEY,
    campus_name VARCHAR(255) NOT NULL
);

-- Create Registrations Table
CREATE TABLE IF NOT EXISTS registrations (
    user_id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    college_id INTEGER NOT NULL REFERENCES colleges(college_id),
    dept_id INTEGER NOT NULL REFERENCES departments(dept_id),
    role_id INTEGER NOT NULL REFERENCES roles(role_id),
    campus_id INTEGER NOT NULL REFERENCES campuses(campus_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Login Table
CREATE TABLE IF NOT EXISTS logins (
    login_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES registrations(user_id),
    password VARCHAR(255) NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for better query performance
CREATE INDEX idx_registration_email ON registrations(email);
CREATE INDEX idx_registration_college_id ON registrations(college_id);
CREATE INDEX idx_registration_dept_id ON registrations(dept_id);
CREATE INDEX idx_login_user_id ON logins(user_id);
