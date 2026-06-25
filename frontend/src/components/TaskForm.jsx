import { useEffect, useState } from "react";
import {
  Box,
  Button,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const priorityOptions = ["Low", "Medium", "High"];
const statusOptions = ["To Do", "In Progress", "Done"];

function TaskForm({ initialData = null, onSubmit, loading, onCancel }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("To Do");
  const [dueDate, setDueDate] = useState("");
  const [dueDateError, setDueDateError] = useState("");

  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 50);
  const maxDateString = maxDate.toISOString().split("T")[0];

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setPriority(initialData.priority || "Medium");
      setStatus(initialData.status || "To Do");
      setDueDate(initialData.dueDate || "");
    } else {
      setTitle("");
      setDescription("");
      setPriority("Medium");
      setStatus("To Do");
      setDueDate("");
    }
  }, [initialData]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title || !description || !dueDate) {
      if (!dueDate) {
        setDueDateError("Due date is required");
      }
      return;
    }

    if (dueDate < today) {
      setDueDateError("Due date cannot be in the past");
      return;
    }

    if (dueDate > maxDateString) {
      setDueDateError("Due date must be within the next 50 years");
      return;
    }

    setDueDateError("");
    await onSubmit({ title, description, priority, status, dueDate });
  };

  return (
    <Paper elevation={4} sx={{ p: 3, borderRadius: 4 }}>
      <Typography variant="h6" mb={2} fontWeight={700}>
        {initialData ? "Update Task" : "Create a New Task"}
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Task title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            fullWidth
            multiline
            minRows={3}
            required
          />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              select
              label="Priority"
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
              fullWidth
            >
              {priorityOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              fullWidth
            >
              {statusOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
          <TextField
            label="Due date"
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            variant="outlined"
            InputLabelProps={{ shrink: true }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <CalendarTodayIcon sx={{ color: "#1976d2" }} />
                </InputAdornment>
              ),
            }}
            inputProps={{
              min: today,
              max: maxDateString,
              sx: {
                padding: "18px 14px",
              },
            }}
            error={!!dueDateError}
            helperText={dueDateError || "Select a due date within the next 50 years"}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#f9fbff',
                borderRadius: 2,
                minHeight: 56,
              },
              '& .MuiOutlinedInput-input': {
                padding: '18px 14px',
                minHeight: 56,
                display: 'flex',
                alignItems: 'center',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#dfe3ea',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1976d2',
              },
            }}
            fullWidth
            required
          />
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            {onCancel && (
              <Button variant="outlined" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
            )}
            <Button type="submit" variant="contained" size="large" disabled={loading}>
              {loading ? (initialData ? "Saving..." : "Adding...") : initialData ? "Save Task" : "Add Task"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Paper>
  );
}

export default TaskForm;
