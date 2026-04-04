import { Avatar, Box, Button, Grid, Stack, TextField, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Loading from "../../components/loading/Loading";
import PageHeader from "../../components/ui/PageHeader";
import SurfaceCard from "../../components/ui/SurfaceCard";
import { colors } from "../../theme/Theme";

function Account() {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    const userId = JSON.parse(localStorage.getItem("cmUser")).userid;
    try {
      setLoading(true);
      const response = await axios.patch(`${process.env.REACT_APP_BASE_URL}/user/reset?userId=${userId}`);
      if (response.status === 200) {
        setLoading(false);
        getUser();
        alert("Reset successfully");
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
      alert("Something went wrong");
    }
  };

  const getUser = async () => {
    const userId = JSON.parse(localStorage.getItem("cmUser")).userid;
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/user/get?userId=${userId}`);
      if (response.status === 200) {
        setUserData(response.data.data.trader);
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  const profileInitials =
    userData && userData.fullName
      ? userData.fullName
          .split(" ")
          .map((name) => name.toUpperCase()[0])
          .slice(0, 2)
          .join("")
      : "U";

  const infoFields = [
    { label: "User ID", value: userData?.userId || "User ID" },
    { label: "Name", value: userData?.fullName || "Full Name" },
    { label: "Email", value: userData?.email || "Email" },
    { label: "Mobile", value: userData?.mobile || "Mobile" },
    { label: "Funds", value: userData?.availableFunds || "Available Funds" },
  ];

  return (
    <Box>
      <PageHeader
        eyebrow="Profile"
        title="Account snapshot"
        description="View your core account information and trigger a reset action without losing the current structure or backend flow."
      />

      <Grid container spacing={2.5}>
        <Grid item xs={12} md={4}>
          <SurfaceCard sx={{ height: "100%" }}>
            <Stack alignItems="center" spacing={2.5} sx={{ textAlign: "center" }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  fontSize: "2rem",
                  fontWeight: 800,
                  background: `linear-gradient(135deg, ${colors.brand} 0%, ${colors.accent} 100%)`,
                  boxShadow: `0 20px 40px ${alpha(colors.brand, 0.28)}`,
                }}
              >
                {profileInitials}
              </Avatar>
              <Stack spacing={0.5}>
                <Typography variant="h5">{userData?.fullName || "Trader profile"}</Typography>
                <Typography sx={{ color: "text.secondary" }}>{userData?.email || "Account details will appear here."}</Typography>
              </Stack>
            </Stack>
          </SurfaceCard>
        </Grid>
        <Grid item xs={12} md={8}>
          <SurfaceCard>
            <Grid container spacing={2}>
              {infoFields.map((field) => (
                <Grid item xs={12} sm={6} key={field.label}>
                  <Stack spacing={0.8}>
                    <Typography sx={{ color: "text.secondary", fontSize: "0.88rem" }}>{field.label}</Typography>
                    <TextField value={field.value} variant="outlined" InputProps={{ readOnly: true }} />
                  </Stack>
                </Grid>
              ))}
            </Grid>
            <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}>
              <Button onClick={handleReset} variant="contained" sx={{ minWidth: 180 }}>
                {loading ? <Loading color="#fff" size={20} /> : "Reset"}
              </Button>
            </Stack>
          </SurfaceCard>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Account;
