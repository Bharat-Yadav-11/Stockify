import React, { useState } from "react";
import {
  Button,
  IconButton,
  InputAdornment,
  Link as MuiLink,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Loading from "../../../components/loading/Loading";
import AuthShell from "../../../components/ui/AuthShell";

function Signin() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleUpdate = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignin = async (e) => {
    e.preventDefault();

    setLoading(true);
    const data = {
      userId: formData.userId,
      password: formData.password,
    };
    try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/user/signin`, data);
      if (response.status === 200) {
        setLoading(false);
        localStorage.setItem("cmUser", JSON.stringify(response.data.data));
        navigate("/app/dashboard", { replace: true });
      }
    } catch (err) {
      console.log(err);
      alert(err.response.data.message);
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Sign in to your trading workspace"
      subtitle="Access your watchlist, order flow, and market dashboard with the same backend logic wrapped in a cleaner interface."
      sideTitle="Sharper decisions start with a calmer interface."
      sideText="This refreshed CRA-friendly UI keeps your existing routes and actions intact while giving the product a more premium feel."
    >
      <form method="post" onSubmit={handleSignin}>
        <Stack spacing={2.2}>
          <TextField onChange={handleUpdate} label="User ID" variant="outlined" name="userId" type="text" required fullWidth />
          <TextField
            onChange={handleUpdate}
            label="Password"
            variant="outlined"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((show) => !show)} edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 1 }}>
            {loading ? <Loading color="#fff" size={20} /> : "Log in"}
          </Button>
          <Typography sx={{ color: "text.secondary", fontSize: "0.94rem" }}>
            Don't have an account?{" "}
            <MuiLink component={Link} to="/signup" underline="hover" color="secondary.main">
              Sign up
            </MuiLink>
          </Typography>
        </Stack>
      </form>
    </AuthShell>
  );
}

export default Signin;
