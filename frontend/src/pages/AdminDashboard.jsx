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
import TaskCard from "../components/TaskCard";

function AdminDashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [user] = useState(() => JSON.parse(localStorage.getItem("user") || "null"));

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await API.get("/tasks", {
        params: { admin: true },
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

    if (!user?.is_admin) {
      navigate("/dashboard");
      return;
    }

    fetchTasks();
  }, [navigate, user?.is_admin]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <Box sx={{ background: "#f4f5fb", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ borderRadius: 4, p: 4 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h4" fontWeight={800} gutterBottom>
                Admin Task Overview
              </Typography>
              <Typography color="text.secondary">
                Welcome, Admin. Here are all tasks across users and creators.
              </Typography>
            </Box>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" justifyContent="space-between">
              <Typography variant="subtitle1" color="text.secondary">
                Showing tasks for all users
              </Typography>
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

            <Box>
              <Typography variant="h6" fontWeight={700} mb={2}>
                Full Task List
              </Typography>

              {loading && <Typography>Loading tasks...</Typography>}

              {!loading && tasks.length === 0 && (
                <Paper sx={{ p: 3, borderRadius: 3 }}>
                  <Typography color="text.secondary">
                    No tasks yet. Ask users to add tasks or check the database.
                  </Typography>
                </Paper>
              )}

              <Grid container spacing={3}>
                {tasks.map((task) => (
                  <Grid item xs={12} md={6} key={task._id}>
                    <TaskCard task={task} />
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

export default AdminDashboard;
