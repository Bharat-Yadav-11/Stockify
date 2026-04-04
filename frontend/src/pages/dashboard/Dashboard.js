import React, { useCallback, useEffect, useState } from "react";
import { Box, Button, Chip, Divider, IconButton, Stack, Typography } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";
import moment from "moment";
import GLTable from "../../components/tables/GLTable";
import Loading from "../../components/loading/Loading";
import SurfaceCard from "../../components/ui/SurfaceCard";
import PageHeader from "../../components/ui/PageHeader";
import { MotionBox, fadeInUp, staggerContainer } from "../../components/ui/Motion";

export default function Dashboard() {
  const [marketStatus, setMarketStatus] = useState([]);
  const [type, setType] = useState("gainers");
  const [refreshGL, setRefreshGL] = useState(false);
  const [marketHolidays, setMarketHolidays] = useState({});
  const [upcomingHolidays, setUpcomingHolidays] = useState({});
  const [refreshMS, setRefreshMS] = useState(false);
  const [refreshHolidays, setRefreshHolidays] = useState(false);

  const getMarketStatus = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/analysis/market-status`);
      if (response.status === 200) {
        setMarketStatus(response.data?.marketStatus?.marketState);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  const refreshMarketStatus = async () => {
    try {
      setRefreshMS(true);
      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/analysis/market-status/save`);
      if (response.status === 200) {
        getMarketStatus();
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    } finally {
      setRefreshMS(false);
    }
  };

  const getUpcomingHoliday = (holidays) => {
    const today = moment();
    const upcomingHolidayList = holidays?.filter((holiday) => moment(holiday.tradingDate).isAfter(today));
    const nearestHoliday = upcomingHolidayList?.length > 0 ? upcomingHolidayList[0] : null;

    if (nearestHoliday) {
      const holidayDate = moment(nearestHoliday.tradingDate);
      const daysRemaining = holidayDate.diff(today, "days");

      return {
        tradingDate: nearestHoliday.tradingDate,
        weekDay: nearestHoliday.weekDay,
        description: nearestHoliday.description,
        daysRemaining: daysRemaining,
      };
    }

    return null;
  };

  const getMarketHolidays = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/market-holidays/get`);

      if (response.status === 200) {
        setMarketHolidays(response.data?.tradingHolidays || {});
        setUpcomingHolidays(getUpcomingHoliday(response.data?.tradingHolidays?.CM));
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  const refreshMarketHolidays = async () => {
    try {
      setRefreshHolidays(true);
      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/market-holidays/save`);
      if (response.status === 200) {
        await getMarketHolidays();
      }
    } catch (err) {
      console.log(err);
      alert("Unable to refresh market holidays right now.");
    } finally {
      setRefreshHolidays(false);
    }
  };

  useEffect(() => {
    getMarketStatus();
    getMarketHolidays();
  }, [getMarketHolidays, getMarketStatus]);

  return (
    <Box>
      <PageHeader
        eyebrow="Overview"
        title="Market pulse and trading highlights"
        description="Track market availability, rotate between gainers and losers, and keep upcoming exchange holidays in view from a single live dashboard."
        action={
          <Button onClick={() => setRefreshGL(true)} variant="outlined" startIcon={<RefreshIcon />}>
            Refresh movers
          </Button>
        }
      />

      <Stack component={MotionBox} variants={staggerContainer} initial="hidden" animate="visible" spacing={2.5}>
        <MotionBox variants={fadeInUp}>
          <SurfaceCard>
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", md: "center" }}
              spacing={2}
              sx={{ mb: 2 }}
            >
              <Stack spacing={0.6}>
                <Typography variant="h5">Market status</Typography>
                <Typography sx={{ color: "text.secondary" }}>
                  Real-time exchange availability pulled from your backend service.
                </Typography>
              </Stack>
              <IconButton onClick={refreshMarketStatus} sx={{ color: "text.primary" }}>
                {refreshMS ? <Loading size={20} color="#fff" /> : <RefreshIcon />}
              </IconButton>
            </Stack>
            <Stack direction="row" spacing={1.25} flexWrap="wrap" useFlexGap>
              {marketStatus && marketStatus.length > 0 ? (
                marketStatus.map((market) => (
                  <Chip
                    key={market.market}
                    icon={
                      market.marketStatus.toLowerCase() === "open" ? (
                        <CircleIcon sx={{ color: "inherit !important", fontSize: "0.9rem !important" }} />
                      ) : (
                        <HorizontalRuleIcon sx={{ color: "inherit !important" }} />
                      )
                    }
                    color={market.marketStatus.toLowerCase() === "open" ? "success" : "default"}
                    label={`${market.market.toUpperCase()} - ${market.marketStatus}`}
                    variant="outlined"
                    sx={{ px: 1.2, py: 2.2 }}
                  />
                ))
              ) : (
                <Typography>No data found.</Typography>
              )}
            </Stack>
          </SurfaceCard>
        </MotionBox>

        <MotionBox variants={fadeInUp}>
          <SurfaceCard sx={{ borderRadius: 4 }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", md: "center" }}
              spacing={2}
              sx={{ mb: 2.5 }}
            >
              <Stack spacing={0.6}>
                <Typography variant="h5">Top movers</Typography>
                <Typography sx={{ color: "text.secondary" }}>
                  Toggle between leading gainers and losers without changing the data flow underneath.
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Button variant={type === "gainers" ? "contained" : "outlined"} color="success" onClick={() => setType("gainers")}>
                  Gainers
                </Button>
                <Button variant={type === "losers" ? "contained" : "outlined"} color="error" onClick={() => setType("losers")}>
                  Losers
                </Button>
              </Stack>
            </Stack>
            <GLTable type={type} refreshGL={refreshGL} setRefreshGL={setRefreshGL} />
          </SurfaceCard>
        </MotionBox>

        <MotionBox variants={fadeInUp}>
          <SurfaceCard>
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", md: "center" }}
              spacing={2}
              sx={{ mb: 2.5 }}
            >
              <Stack spacing={0.6}>
                <Typography variant="h5">Market holidays</Typography>
                <Typography sx={{ color: "text.secondary" }}>
                  Upcoming exchange closures are highlighted so you can plan entries and exits ahead of schedule.
                </Typography>
              </Stack>
              <Button
                onClick={refreshMarketHolidays}
                variant="outlined"
                startIcon={refreshHolidays ? <Loading size={16} color="#fff" /> : <RefreshIcon />}
              >
                Refresh holidays
              </Button>
            </Stack>
            <Stack spacing={0.4}>
              {marketHolidays?.CM?.length ? (
                marketHolidays.CM.map((holiday, index) => {
                  const isUpcoming = upcomingHolidays?.tradingDate === holiday.tradingDate;
                  return (
                    <Box key={holiday.tradingDate + index}>
                      {index > 0 ? <Divider /> : null}
                      <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={1.2}
                        justifyContent="space-between"
                        alignItems={{ xs: "flex-start", md: "center" }}
                        sx={{ py: 2 }}
                      >
                        <Stack spacing={1} sx={{ flex: 1 }}>
                          <Typography sx={{ fontWeight: 700, color: isUpcoming ? "secondary.main" : "text.primary" }}>
                            {holiday.description}
                          </Typography>
                          {isUpcoming ? (
                            <Chip label={`${upcomingHolidays.daysRemaining} days remaining`} color="secondary" sx={{ alignSelf: "flex-start" }} />
                          ) : null}
                        </Stack>
                        <Typography sx={{ minWidth: 120, color: "text.secondary" }}>{holiday.tradingDate}</Typography>
                        <Typography sx={{ minWidth: 120, color: "text.secondary" }}>{holiday.weekDay}</Typography>
                      </Stack>
                    </Box>
                  );
                })
              ) : (
                <Typography sx={{ color: "text.secondary" }}>
                  No holiday data is stored yet. Use refresh to fetch the latest NSE trading holidays.
                </Typography>
              )}
            </Stack>
          </SurfaceCard>
        </MotionBox>
      </Stack>
    </Box>
  );
}
