import React, { useEffect, useState } from "react";
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
import {
  validateConfirmPassword,
  validateEmail,
  validateFullName,
  validateMobileNumber,
  validatePassword,
} from "../../../helpers/FormValidation";

function Signup() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleUpdate = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const { fullName, mobile, email, password, confirmPassword } = formData;
    const formErrors = {
      fullName: validateFullName(fullName),
      mobile: validateMobileNumber(mobile),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(password, confirmPassword),
    };

    if (Object.values(formErrors).every((error) => error === undefined)) {
      setErrors({});
      setLoading(true);
      try {
        const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/user/signup`, {
          fullName,
          mobile,
          email,
          password,
        });
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
    } else {
      setErrors(formErrors);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("cmUser")) {
      navigate("/app/dashboard", { replace: true });
    }
  }, [navigate]);

  return (
    <AuthShell
      title="Create your MarketPulse account"
      subtitle="Set up access to the dashboard with the same validation and authentication flow, now wrapped in a more intentional onboarding experience."
      sideTitle="A modern first impression for an older CRA stack."
      sideText="The redesign stays compatible with your current app structure while making the product feel much more current."
    >
      <form method="post" onSubmit={handleSignup}>
        <Stack spacing={2.2}>
          <Stack spacing={0.7}>
            <TextField label="Full name" variant="outlined" name="fullName" type="text" onChange={handleUpdate} required fullWidth />
            {errors.fullName ? <Typography color="error">{errors.fullName}</Typography> : null}
          </Stack>
          <Stack spacing={0.7}>
            <TextField label="Email" variant="outlined" name="email" type="email" onChange={handleUpdate} required fullWidth />
            {errors.email ? <Typography color="error">{errors.email}</Typography> : null}
          </Stack>
          <Stack spacing={0.7}>
            <TextField label="Mobile number" variant="outlined" name="mobile" type="text" onChange={handleUpdate} required fullWidth />
            {errors.mobile ? <Typography color="error">{errors.mobile}</Typography> : null}
          </Stack>
          <Stack spacing={0.7}>
            <TextField
              label="Password"
              variant="outlined"
              name="password"
              type={showPassword ? "text" : "password"}
              onChange={handleUpdate}
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
            {errors.password ? <Typography color="error">{errors.password}</Typography> : null}
          </Stack>
          <Stack spacing={0.7}>
            <TextField
              label="Confirm password"
              variant="outlined"
              name="confirmPassword"
              onChange={handleUpdate}
              type={showConfirmPassword ? "text" : "password"}
              required
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword((show) => !show)} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {errors.confirmPassword ? <Typography color="error">{errors.confirmPassword}</Typography> : null}
          </Stack>
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 1 }}>
            {loading ? <Loading color="#fff" size={20} /> : "Register"}
          </Button>
          <Typography sx={{ color: "text.secondary", fontSize: "0.94rem" }}>
            Already have an account?{" "}
            <MuiLink component={Link} to="/signin" underline="hover" color="secondary.main">
              Log in
            </MuiLink>
          </Typography>
        </Stack>
      </form>
    </AuthShell>
  );
}

export default Signup;
