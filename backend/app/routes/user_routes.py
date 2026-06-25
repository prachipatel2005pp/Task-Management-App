from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.models.user_model import User
from app.database import user_collection
from bson import ObjectId
	
ADMIN_EMAIL = "admin@taskapp.com"
ADMIN_PASSWORD = "Admin@1234"

class LoginRequest(BaseModel):
    email: str
    password: str

user_router = APIRouter()

# Helper function
def user_helper(user) -> dict:
    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"],
        "password": user["password"]
    }

# =========================
# REGISTER USER (POST)
# =========================
@user_router.post("/register")
async def register_user(user: User):
    existing_user = await user_collection.find_one({"email": user.email})

    if user.email == ADMIN_EMAIL:
        raise HTTPException(status_code=400, detail="Cannot register admin email")

    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    new_user = await user_collection.insert_one(user.dict())
    created_user = await user_collection.find_one({"_id": new_user.inserted_id})

    return {"message": "User registered successfully", "user": user_helper(created_user)}

# =========================
# LOGIN USER (POST)
# =========================
@user_router.post("/login")
async def login_user(user: LoginRequest):
    if user.email == ADMIN_EMAIL:
        if user.password != ADMIN_PASSWORD:
            raise HTTPException(status_code=400, detail="Incorrect password")

        return {
            "message": "Login successful",
            "user": {
                "id": "admin",
                "name": "Admin",
                "email": ADMIN_EMAIL,
                "is_admin": True,
            },
        }

    db_user = await user_collection.find_one({"email": user.email})

    if not db_user:
        raise HTTPException(status_code=400, detail="User not found")

    if db_user["password"] != user.password:
        raise HTTPException(status_code=400, detail="Incorrect password")

    return {
        "message": "Login successful",
        "user": {**user_helper(db_user), "is_admin": False},
    }

# =========================
# GET ALL USERS
# =========================
@user_router.get("/users")
async def get_users():
    users = []
    async for user in user_collection.find():
        users.append(user_helper(user))
    return users

# =========================
# GET SINGLE USER
# =========================
@user_router.get("/users/{id}")
async def get_user(id: str):
    user = await user_collection.find_one({"_id": ObjectId(id)})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user_helper(user)

# =========================
# DELETE USER
# =========================
@user_router.delete("/users/{id}")
async def delete_user(id: str):
    result = await user_collection.delete_one({"_id": ObjectId(id)})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "User deleted successfully"}

