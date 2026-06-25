import { useState } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  Stack,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");

  const onSubmit = async (data) => {
    try {
      const response = await API.post("/login", data);
      localStorage.setItem("token", "dummy-token");
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setAlertSeverity("success");
      setSnackbarMessage("Login successful. Redirecting...");
      setOpen(true);
      setTimeout(() => {
        if (response.data.user?.is_admin) {
          navigate("/admin-dashboard");
        } else {
          navigate("/dashboard");
        }
      }, 1000);
    } catch (error) {
      const detail = error.response?.data?.detail;
      const message =
        typeof detail === "string"
          ? detail
          : Array.isArray(detail)
          ? detail.map((item) => item.msg || item).join(", ")
          : error.message;
      setAlertSeverity("error");
      setSnackbarMessage(message || "Unable to login. Please try again.");
      setOpen(true);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 45%, #8b5cf6 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
      }}
    >
      <Paper
        elevation={14}
        sx={{
          maxWidth: 420,
          width: "100%",
          borderRadius: 5,
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: 5, backgroundColor: "#fafbff" }}>
          <Typography variant="h4" fontWeight={800} gutterBottom>
            Welcome back
          </Typography>
          <Typography color="text.secondary" mb={3}>
            Sign in to continue managing your tasks efficiently.
          </Typography>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Email"
                {...register("email", { required: "Email is required" })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                {...register("password", { required: "Password is required" })}
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button type="submit" variant="contained" size="large">
                Login
              </Button>
            </Stack>
          </form>

          <Typography align="center" mt={4} color="text.secondary">
            New to the app?{' '}
            <Link to="/register" style={{ color: "#3b82f6", textDecoration: "none" }}>
              Create account
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

export default Login;
