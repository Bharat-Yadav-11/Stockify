import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CandlestickChartRoundedIcon from "@mui/icons-material/CandlestickChartRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import { alpha } from "@mui/material/styles";
import axios from "axios";
import BuySellModal from "../modals/BuySellModal";
import { useNavigate } from "react-router-dom";
import Loading from "../loading/Loading";
import { MotionBox, fadeInUp } from "../ui/Motion";
import { colors } from "../../theme/Theme";

function Watchlist() {
  const [inputStock, setInputStock] = useState("");
  const [stocks, setStocks] = useState([]);
  const [userWatchlist, setUserWatchlist] = useState([]);
  const [hoverIndex, setHoverIndex] = useState(false);
  const [userId, setUserId] = useState("");
  const [open, setOpen] = useState(false);
  const [stock, setStock] = useState({});
  const [orderType, setOrderType] = useState("");
  const [loadingId, setLoadingId] = useState("");
  const [searching, setSearching] = useState(false);

  const navigate = useNavigate();

  const apiBaseUrl = useMemo(
    () => process.env.REACT_APP_BASE_URL || "http://localhost:5000/api",
    []
  );

  const socketUrl = useMemo(() => {
    try {
      const parsedUrl = new URL(apiBaseUrl);
      const protocol = parsedUrl.protocol === "https:" ? "wss:" : "ws:";
      return `${protocol}//${parsedUrl.host}`;
    } catch (err) {
      return "ws://localhost:5000";
    }
  }, [apiBaseUrl]);

  const handleSearchStock = async () => {
    const query = inputStock.trim();
    if (!query) {
      setStocks([]);
      return;
    }

    try {
      setSearching(true);
      let response = await axios.get(`${apiBaseUrl}/scrip/search`, {
        params: { scriptName: query },
      });

      let searchResults = response.status === 200 ? response.data.data || [] : [];

      if (!searchResults.length) {
        const fallbackResponse = await axios.get(`${apiBaseUrl}/scrip/all`);
        const allScrips = fallbackResponse?.data?.data || [];
        searchResults = allScrips
          .filter((scrip) => {
            const scriptName = scrip.scriptName || "";
            const symbol = scrip.symbol || "";
            return (
              scriptName.toLowerCase().includes(query.toLowerCase()) ||
              symbol.toLowerCase().includes(query.toLowerCase())
            );
          })
          .slice(0, 20);
      }

      setStocks(searchResults);
    } catch (err) {
      console.log(err);
      alert("Internal server error");
    } finally {
      setSearching(false);
    }
  };

  const getUserWatchlist = useCallback(async () => {
    if (!userId) {
      return;
    }

    try {
      const response = await axios.get(`${apiBaseUrl}/watchlist/get?userId=${userId}`);
      if (response.status === 200) {
        setUserWatchlist(response.data.data);
      }
    } catch (err) {
      console.log(err);
      alert("Internal server error");
    }
  }, [apiBaseUrl, userId]);

  const handleAddStockToWatchlist = async (selectedStock) => {
    const data = {
      userId: userId,
      scriptId: selectedStock._id,
    };
    try {
      setLoadingId(selectedStock._id);
      const response = await axios.post(`${apiBaseUrl}/watchlist/add`, data);
      if (response.status === 200) {
        getUserWatchlist();
        setInputStock("");
        setLoadingId("");
        setStocks([]);
        alert("Added to watchlist");
      }
    } catch (err) {
      console.log(err);
      setLoadingId("");
      alert(err.response?.data?.message || "Unable to add this symbol right now.");
    }
  };

  const handleRemoveStockToWatchlist = async (watchlistStockId) => {
    try {
      const response = await axios.delete(`${apiBaseUrl}/watchlist/remove?watchlistScripId=${watchlistStockId}`);
      if (response.status === 200) {
        getUserWatchlist();
        alert("Removed");
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
    }
  };

  const handleBuySellStock = (selectedStock, type) => {
    setOpen(true);
    setOrderType(type);
    setStock(selectedStock);
  };

  const handleShowChart = (selectedStock) => {
    navigate(`/app/chart?symbol=${selectedStock.scriptId.originalName}`);
  };

  useEffect(() => {
    setUserId(JSON.parse(localStorage.getItem("cmUser"))?.userid);
  }, []);

  useEffect(() => {
    if (userId) {
      getUserWatchlist();
    }
  }, [getUserWatchlist, userId]);

  useEffect(() => {
    if (!userId) {
      return undefined;
    }

    const ws = new WebSocket(socketUrl);

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          userId: userId,
        })
      );
    };

    ws.onmessage = (ev) => {
      const watchlistData = JSON.parse(ev.data);
      if (Array.isArray(watchlistData.scrips)) {
        setUserWatchlist(watchlistData.scrips);
      }
    };

    ws.onclose = () => {
      console.log("Connection closed!!");
    };

    return () => {
      ws.close();
    };
  }, [socketUrl, userId]);

  const renderSearchResults = () => {
    if (!stocks || stocks.length === 0) {
      return (
        <Typography sx={{ color: "text.secondary", textAlign: "center", py: 4 }}>
          No matching symbols found.
        </Typography>
      );
    }

    return stocks.map((result) => (
      <MotionBox key={result._id} variants={fadeInUp}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            px: 1.5,
            py: 1.2,
            borderRadius: 3,
            border: `1px solid ${alpha(colors.white, 0.06)}`,
            backgroundColor: alpha(colors.surfaceSoft, 0.48),
          }}
        >
          <Stack spacing={0.4}>
            <Typography sx={{ fontWeight: 700 }}>{result.symbol}</Typography>
            <Typography sx={{ color: "text.secondary", fontSize: "0.82rem" }}>
              Add this symbol to your active radar.
            </Typography>
          </Stack>
          {loadingId === result._id ? (
            <Loading size={22} />
          ) : (
            <IconButton
              onClick={() => handleAddStockToWatchlist(result)}
              sx={{
                color: colors.textPrimary,
                backgroundColor: alpha(colors.brand, 0.16),
                "&:hover": { backgroundColor: alpha(colors.brand, 0.24) },
              }}
            >
              <AddRoundedIcon />
            </IconButton>
          )}
        </Stack>
      </MotionBox>
    ));
  };

  const renderWatchlist = () => {
    if (!userWatchlist.length) {
      return (
        <Stack
          spacing={1}
          alignItems="center"
          justifyContent="center"
          sx={{
            py: 8,
            borderRadius: 4,
            border: `1px dashed ${colors.border}`,
            backgroundColor: alpha(colors.white, 0.02),
          }}
        >
          <Typography variant="h6">Your watchlist is empty</Typography>
          <Typography sx={{ color: "text.secondary", textAlign: "center", maxWidth: 280 }}>
            Search for a symbol above and start building a faster, more focused trading shortlist.
          </Typography>
        </Stack>
      );
    }

    return userWatchlist.map((watchlistStock) => {
      const change = parseFloat(watchlistStock.scriptId.percentageChange || 0);
      const isPositive = change >= 0;
      return (
        <MotionBox key={watchlistStock._id} variants={fadeInUp}>
          <Stack
            onMouseOver={() => setHoverIndex(watchlistStock._id)}
            onMouseLeave={() => setHoverIndex(-1)}
            spacing={1.1}
            sx={{
              px: 1.5,
              py: 1.35,
              borderRadius: 3.5,
              border: `1px solid ${alpha(colors.white, 0.06)}`,
              backgroundColor: alpha(colors.surfaceSoft, hoverIndex === watchlistStock._id ? 0.9 : 0.55),
              transition: "all 180ms ease",
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Stack spacing={0.4}>
                <Typography sx={{ fontWeight: 700 }}>{watchlistStock.scriptId.symbol}</Typography>
                <Typography sx={{ color: "text.secondary", fontSize: "0.82rem" }}>
                  {watchlistStock.scriptId.exchange || "Market"}
                </Typography>
              </Stack>
              <Chip
                icon={isPositive ? <TrendingUpRoundedIcon /> : <TrendingDownRoundedIcon />}
                label={`${change}%`}
                sx={{
                  color: isPositive ? colors.success : colors.danger,
                  backgroundColor: alpha(isPositive ? colors.success : colors.danger, 0.12),
                }}
              />
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography sx={{ color: "text.secondary", fontSize: "0.85rem" }}>Last traded price</Typography>
              <Typography sx={{ fontWeight: 700 }}>{watchlistStock.scriptId.lastPrice || 0}</Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <Button
                fullWidth
                onClick={() => handleBuySellStock(watchlistStock, "Buy")}
                sx={{
                  color: colors.textPrimary,
                  backgroundColor: alpha(colors.info, 0.18),
                  "&:hover": { backgroundColor: alpha(colors.info, 0.28) },
                }}
              >
                Buy
              </Button>
              <Button
                fullWidth
                onClick={() => handleBuySellStock(watchlistStock, "Sell")}
                sx={{
                  color: colors.textPrimary,
                  backgroundColor: alpha(colors.brand, 0.18),
                  "&:hover": { backgroundColor: alpha(colors.brand, 0.28) },
                }}
              >
                Sell
              </Button>
              <IconButton
                onClick={() => handleShowChart(watchlistStock)}
                sx={{
                  borderRadius: 2.5,
                  color: colors.textPrimary,
                  backgroundColor: alpha(colors.accent, 0.14),
                }}
              >
                <CandlestickChartRoundedIcon />
              </IconButton>
              <IconButton
                onClick={() => handleRemoveStockToWatchlist(watchlistStock._id)}
                sx={{
                  borderRadius: 2.5,
                  color: colors.textPrimary,
                  backgroundColor: alpha(colors.danger, 0.14),
                }}
              >
                <DeleteOutlineRoundedIcon />
              </IconButton>
            </Stack>
          </Stack>
        </MotionBox>
      );
    });
  };

  return (
    <Box sx={{ width: "100%", height: "100%" }}>
      <BuySellModal open={open} setOpen={setOpen} orderType={orderType} stock={stock} />
      <Stack spacing={2}>
        <Stack direction="row" spacing={1.2}>
          <TextField
            fullWidth
            value={inputStock}
            onChange={(e) => setInputStock(e.target.value.toUpperCase())}
            label="Search stock"
            variant="outlined"
          />
          <Button onClick={handleSearchStock} variant="contained" startIcon={<SearchRoundedIcon />}>
            {searching ? "Searching..." : "Search"}
          </Button>
        </Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography sx={{ color: "text.secondary", fontSize: "0.88rem" }}>
            {inputStock ? "Search results" : "Live watchlist"}
          </Typography>
          <Typography sx={{ color: "text.secondary", fontSize: "0.88rem" }}>
            {inputStock ? `${stocks.length} results` : `${userWatchlist.length} tracked`}
          </Typography>
        </Stack>
        <Divider />
        <Stack spacing={1.2} sx={{ maxHeight: 620, overflowY: "auto", pr: 0.25 }}>
          {searching ? (
            <Box sx={{ py: 5 }}>
              <Loading />
            </Box>
          ) : inputStock ? (
            renderSearchResults()
          ) : (
            renderWatchlist()
          )}
        </Stack>
      </Stack>
    </Box>
  );
}

export default Watchlist;
