import { useState } from "react";
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import API from "../services/api";

function Register() {
  const [open, setOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const { confirmPassword, ...payload } = data;
      const response = await API.post("/register", payload);
      const user = response.data.user;
      localStorage.setItem("token", "dummy-token");
      localStorage.setItem("user", JSON.stringify(user));
      setAlertSeverity("success");
      setSnackbarMessage("Registration successful. Redirecting to your dashboard...");
      setOpen(true);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
    } catch (error) {
      const detail = error.response?.data?.detail;
      const message =
        typeof detail === "string"
          ? detail
          : Array.isArray(detail)
          ? detail.map((item) => item.msg || item).join(", ")
          : error.message;
      setAlertSeverity("error");
      setSnackbarMessage(message || "Registration failed. Please try again.");
      setOpen(true);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #0f172a 0%, #2563eb 35%, #7c3aed 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
      }}
    >
      <Paper
        elevation={14}
        sx={{
          maxWidth: 470,
          width: "100%",
          borderRadius: 5,
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: 5, backgroundColor: "#ffffff" }}>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Create your account
          </Typography>
          <Typography color="text.secondary" mb={3}>
            Register now to start managing project tasks in real time.
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Full Name"
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
              <TextField
                fullWidth
                label="Email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                    message: "Enter a valid email address",
                  },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              <TextField
                fullWidth
                type="password"
                label="Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                  pattern: {
                    value: /^(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/, 
                    message: "Password must include at least one number and one special character",
                  },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
              <TextField
                fullWidth
                type="password"
                label="Confirm Password"
                {...register("confirmPassword", {
                  required: "Confirm password is required",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
              />
              <Button type="submit" variant="contained" fullWidth size="large">
                Register
              </Button>
            </Stack>
          </form>

          <Typography align="center" mt={4} color="text.secondary">
            Already registered?{' '}
            <Link to="/" style={{ color: "#2563eb", textDecoration: "none" }}>
              Login here
            </Link>
          </Typography>
        </Box>
      </Paper>

      <Snackbar open={open} autoHideDuration={3000} onClose={() => setOpen(false)}>
        <Alert severity={alertSeverity}>{snackbarMessage}</Alert>
      </Snackbar>
    </Box>
  );
}

export default Register;
