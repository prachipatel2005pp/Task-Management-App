from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.task_routes import router as task_router
from app.routes.user_routes import user_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(task_router)
app.include_router(user_router)

@app.get("/")
def home():
    return {"message": "Task Management API Running"}
