import { Box, Stack, Typography } from "@mui/material";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useLocation } from "react-router-dom";
import Loading from "../../components/loading/Loading";
import PageHeader from "../../components/ui/PageHeader";
import { colors } from "../../theme/Theme";

function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0");
  const day = today.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDateXDaysAgo(numDays) {
  const today = new Date();
  const pastDate = new Date(today.getTime() - numDays * 24 * 60 * 60 * 1000);
  const year = pastDate.getFullYear();
  const month = (pastDate.getMonth() + 1).toString().padStart(2, "0");
  const day = pastDate.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function TradingChart() {
  const [data, setData] = useState([]);
  const [timeFrame] = useState("5");
  const [fromDate] = useState(getDateXDaysAgo(0));
  const [toDate] = useState(getCurrentDate());
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const scrip = new URLSearchParams(location.search).get("symbol");

  const options = {
    chart: {
      type: "candlestick",
      height: 350,
      background: "transparent",
      toolbar: {
        show: true,
      },
      zoom: {
        enabled: true,
        type: "x",
        autoScaleYaxis: true,
      },
    },
    theme: {
      mode: "dark",
    },
    grid: {
      borderColor: "rgba(148, 163, 184, 0.15)",
    },
    title: {
      text: `${scrip || "Symbol"} candlestick chart`,
      align: "left",
      style: {
        color: colors.textPrimary,
      },
    },
    xaxis: {
      type: "datetime",
      labels: {
        style: {
          colors: colors.textSecondary,
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: colors.textSecondary,
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    annotations: {
      xaxis: [
        {
          x: new Date().getTime(),
          borderColor: colors.info,
          label: {
            borderColor: colors.info,
            style: {
              fontSize: "12px",
              color: "#fff",
              background: colors.info,
            },
            text: "Today",
          },
        },
      ],
    },
  };

  const series = [
    {
      name: `Candlestick Chart - ${timeFrame}`,
      data: data.map((d) => [new Date(d.time).getTime(), d.open, d.high, d.low, d.close]),
    },
  ];

  const getHistoricalScripData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/historical/get?scrip=${scrip}&timeFrame=${timeFrame}&fromDate=${fromDate}&toDate=${toDate}`
      );
      if (response.status === 200) {
        const allData = [];
        response.data.data.candles.forEach((candle) => {
          allData.push({
            time: new Date(candle[0]).getTime(),
            open: candle[1],
            high: candle[2],
            low: candle[3],
            close: candle[4],
          });
        });
        setData(allData);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [fromDate, scrip, timeFrame, toDate]);

  useEffect(() => {
    getHistoricalScripData();
  }, [getHistoricalScripData]);

  return (
    <Box sx={{ flexGrow: 1, padding: 2 }}>
      <PageHeader
        eyebrow="Chart"
        title={scrip ? `${scrip} technical chart` : "Technical chart"}
        description="A cleaner full-width chart area with stronger contrast and a calmer presentation for historical candle data."
      />
      <Box
        sx={{
          p: 2,
          borderRadius: 4,
          border: "1px solid rgba(148, 163, 184, 0.18)",
          backgroundColor: "rgba(16, 31, 53, 0.72)",
        }}
      >
        {loading ? (
          <Stack alignItems="center" justifyContent="center" sx={{ minHeight: 420 }}>
            <Loading />
            <Typography sx={{ mt: 1.5, color: "text.secondary" }}>Loading chart data...</Typography>
          </Stack>
        ) : (
          <ReactApexChart options={options} series={series} type="candlestick" height={520} />
        )}
      </Box>
    </Box>
  );
}

export default TradingChart;
