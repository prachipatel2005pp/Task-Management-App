from fastapi import APIRouter
from app.database import task_collection, user_collection
from app.models.task_model import Task
from bson import ObjectId

router = APIRouter()

# Create Task
@router.post("/tasks")
async def create_task(task: Task):

    task_dict = task.dict()

    if task.owner_id and not task.owner_name:
        if task.owner_id == "admin":
            task_dict["owner_name"] = "Admin"
        else:
            try:
                owner = await user_collection.find_one({"_id": ObjectId(task.owner_id)})
                if owner:
                    task_dict["owner_name"] = owner.get("name")
            except Exception:
                task_dict["owner_name"] = task.owner_id

    result = await task_collection.insert_one(task_dict)
    created_task = await task_collection.find_one({"_id": result.inserted_id})
    created_task["_id"] = str(created_task["_id"])

    return created_task

async def _resolve_owner_name(task: dict) -> dict:
    if task.get("owner_name"):
        return task

    owner_id = task.get("owner_id")
    if owner_id == "admin":
        task["owner_name"] = "Admin"
    elif owner_id:
        try:
            owner = await user_collection.find_one({"_id": ObjectId(owner_id)})
            if owner:
                task["owner_name"] = owner.get("name")
        except Exception:
            task["owner_name"] = owner_id

    if task.get("owner_name") and task.get("_id"):
        try:
            await task_collection.update_one(
                {"_id": ObjectId(task["_id"])},
                {"$set": {"owner_name": task["owner_name"]}}
            )
        except Exception:
            pass

    return task

@router.get("/tasks")
async def get_tasks(user_id: str | None = None, admin: bool = False):

    tasks = []
    if admin:
        query = {}
    elif user_id:
        query = {"owner_id": user_id}
    else:
        return []

    async for task in task_collection.find(query):
        task["_id"] = str(task["_id"])
        task = await _resolve_owner_name(task)
        tasks.append(task)

    return tasks

@router.put("/tasks/{task_id}")
async def update_task(task_id: str, task: Task):

    await task_collection.update_one(
        {"_id": ObjectId(task_id)},
        {"$set": task.dict()}
    )

    return {"message": "Task Updated"}
@router.delete("/tasks/{task_id}")
async def delete_task(task_id: str):

    await task_collection.delete_one(
        {"_id": ObjectId(task_id)}
    )

    return {"message": "Task Deleted"}



