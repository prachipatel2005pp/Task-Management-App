import {
  Box,
  Chip,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

function TaskCard({ task, onEdit, onDelete }) {
  const colorMap = {
    "To Do": "info",
    "In Progress": "warning",
    Done: "success",
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        borderRadius: 4,
        minHeight: 220,
      }}
    >
      <Stack spacing={2}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h6" fontWeight={700}>
              {task.title}
            </Typography>
            {(task.owner_name || task.owner_id) && (
              <Typography color="text.secondary" variant="body2" sx={{ mt: 0.5 }}>
                Created by {task.owner_name || task.owner_id}
              </Typography>
            )}
            <Typography color="text.secondary" variant="body2" sx={{ mt: task.owner_name || task.owner_id ? 0.5 : 0.5 }}>
              {task.description}
            </Typography>
          </Box>
          {(onEdit || onDelete) && (
            <Stack direction="row" spacing={1}>
              {onEdit && (
                <IconButton size="small" color="primary" onClick={() => onEdit(task)}>
                  <EditIcon />
                </IconButton>
              )}
              {onDelete && (
                <IconButton size="small" color="error" onClick={() => onDelete(task._id)}>
                  <DeleteIcon />
                </IconButton>
              )}
            </Stack>
          )}
        </Box>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Chip label={task.priority} color="primary" size="small" />
          <Chip
            label={task.status}
            color={colorMap[task.status] || "default"}
            size="small"
          />
          <Chip label={`Due ${task.dueDate}`} size="small" />
        </Stack>
      </Stack>
    </Paper>
  );
}

export default TaskCard;
