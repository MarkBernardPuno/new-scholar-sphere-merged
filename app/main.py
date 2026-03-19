from fastapi import FastAPI
from database.database import Base, engine
from app.routes import colleges, departments, roles, campuses, registrations, logins

# Create tables
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Scholar Sphere API",
    description="CRUD API for user registration and authentication",
    version="1.0.0"
)

# Include routers
app.include_router(colleges.router)
app.include_router(departments.router)
app.include_router(roles.router)
app.include_router(campuses.router)
app.include_router(registrations.router)
app.include_router(logins.router)


# ======================== ROOT ENDPOINT ========================

@app.get("/", tags=["Root"])
def read_root():
    """Welcome endpoint"""
    return {
        "message": "Welcome to Scholar Sphere API",
        "version": "1.0.0",
        "docs": "/docs"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
