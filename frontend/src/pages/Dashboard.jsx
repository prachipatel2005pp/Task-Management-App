import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";

function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [user] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await API.get("/tasks", {
        params: { user_id: user?.id },
      });
      setTasks(response.data);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Unable to load tasks from backend."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    if (user?.is_admin) {
      navigate("/admin-dashboard");
      return;
    }

    fetchTasks();
  }, [navigate, user?.is_admin]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const handleStartCreate = () => {
    setEditingTask(null);
    setShowForm(true);
    setError("");
  };

  const handleStartEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
    setError("");
  };

  const handleCancelForm = () => {
    setEditingTask(null);
    setShowForm(false);
  };

  const handleSaveTask = async (taskData) => {
    setSaving(true);
    try {
      const payload = {
        ...taskData,
        owner_id: user?.id,
        owner_name: user?.name,
      };
      if (editingTask) {
        await API.put(`/tasks/${editingTask._id}`, payload);
      } else {
        await API.post("/tasks", payload);
      }
      await fetchTasks();
      setEditingTask(null);
      setShowForm(false);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Unable to save task. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await API.delete(`/tasks/${taskId}`);
      setTasks((current) => current.filter((task) => task._id !== taskId));
    } catch (err) {
      setError(
        err.response?.data?.detail || "Unable to delete task. Please try again."
      );
    }
  };

  return (
    <Box sx={{ background: "#f4f5fb", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ borderRadius: 4, p: 4 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4" fontWeight={800} gutterBottom>
                Task Management
              </Typography>
              <Typography color="text.secondary">
                Welcome back{user?.name ? `, ${user.name}` : ""}. Click Create Task to add a task, then edit or delete it as needed.
              </Typography>
            </Box>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" justifyContent="space-between">
              <Button variant="contained" size="large" onClick={handleStartCreate}>
                Create Task
              </Button>
              <Button
                color="secondary"
                onClick={handleLogout}
                sx={{
                  transition: "background-color 0.2s ease, color 0.2s ease",
                  '&:hover': {
                    backgroundColor: "#d32f2f",
                    color: "#fff",
                  },
                }}
              >
                Logout
              </Button>
            </Stack>

            {error && (
              <Alert severity="error">
                {error}
              </Alert>
            )}

            {showForm && (
              <Box>
                <TaskForm
                  initialData={editingTask}
                  onSubmit={handleSaveTask}
                  loading={saving}
                  onCancel={handleCancelForm}
                />
              </Box>
            )}

            <Box>
              <Typography variant="h6" fontWeight={700} mb={2}>
                Tasks
              </Typography>

              {loading && <Typography>Loading tasks...</Typography>}

              {!loading && tasks.length === 0 && (
                <Paper sx={{ p: 3, borderRadius: 3 }}>
                  <Typography color="text.secondary">
                    No tasks yet. Click Create Task to start tracking work.
                  </Typography>
                </Paper>
              )}

              <Grid container spacing={3}>
                {tasks.map((task) => (
                  <Grid item xs={12} md={6} key={task._id}>
                    <TaskCard task={task} onEdit={handleStartEdit} onDelete={handleDeleteTask} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}

export default Dashboard;
