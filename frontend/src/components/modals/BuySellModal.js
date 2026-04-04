import React, { useState } from "react";
import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { alpha } from "@mui/material/styles";
import axios from "axios";
import Loading from "../loading/Loading";
import { colors } from "../../theme/Theme";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "min(92vw, 560px)",
  bgcolor: "background.paper",
  boxShadow: 24,
  outline: "none",
  borderRadius: "24px",
  overflow: "hidden",
};

export default function BuySellModal({ orderType, open, setOpen, stock }) {
  const [productType, setProductType] = useState("");
  const [priceType, setPriceType] = useState("");
  const [qty, setQty] = useState("1");
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [marginRequired, setMarginRequired] = useState(0.0);

  const handleClose = () => {
    setQty(1);
    setPrice(0);
    setPriceType("");
    setProductType("");
    setOpen(false);
  };

  const handleOnOrder = async () => {
    if (!productType || !priceType) {
      alert("You haven't choose any one");
      return;
    }

    const data = {
      stockId: stock.scriptId._id,
      orderType: orderType,
      priceType: priceType,
      productType: productType,
      qty: qty,
      price: price,
      userId: JSON.parse(localStorage.getItem("cmUser")).userid,
      stockPrice: stock.scriptId.lastPrice,
    };

    setLoading(true);

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/stock/${orderType.toLowerCase()}`, data);
      if (response.status === 200) {
        setLoading(false);
        handleClose();
        alert(priceType.toLowerCase() === "market" ? "Order completed successfully" : "Order placed successfully");
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
      alert("Something went wrong");
    }
  };

  const handleRefreshMargin = () => {
    const marginReq = qty * (priceType.toLowerCase() === "market" ? stock.scriptId.lastPrice : price);
    setMarginRequired((marginReq / 5).toFixed(2));
  };

  const accentColor = orderType?.toLowerCase() === "buy" ? colors.info : colors.brand;

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Stack
          spacing={3}
          sx={{
            p: 3,
            background: `linear-gradient(180deg, ${alpha(colors.surfaceAlt, 0.97)} 0%, ${alpha(colors.surface, 0.96)} 100%)`,
          }}
        >
          <Stack
            spacing={0.75}
            sx={{
              p: 2.4,
              borderRadius: 4,
              background: `linear-gradient(135deg, ${alpha(accentColor, 0.2)} 0%, ${alpha(colors.background, 0.25)} 100%)`,
              border: `1px solid ${alpha(accentColor, 0.28)}`,
            }}
          >
            <Typography variant="h5">
              {orderType} {stock?.scriptId?.symbol}
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>
              {stock?.scriptId?.exchange}: Rs. {stock?.scriptId?.lastPrice}
            </Typography>
          </Stack>

          <Stack spacing={2}>
            <Stack spacing={1}>
              <Typography sx={{ color: "text.secondary", fontSize: "0.85rem" }}>Product type</Typography>
              <ToggleButtonGroup
                exclusive
                value={productType}
                onChange={(event, value) => {
                  if (value) {
                    setProductType(value);
                  }
                }}
                fullWidth
              >
                <ToggleButton value="MIS">MIS</ToggleButton>
                <ToggleButton value="NRML">NRML</ToggleButton>
              </ToggleButtonGroup>
            </Stack>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
              <TextField value={qty} onChange={(e) => setQty(e.target.value)} fullWidth label="Qty (Lot Size 1)" />
              <TextField
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                fullWidth
                label="Price (tick size 0.05)"
                disabled={priceType.toLowerCase() === "market"}
              />
            </Stack>

            <Stack spacing={1}>
              <Typography sx={{ color: "text.secondary", fontSize: "0.85rem" }}>Price type</Typography>
              <ToggleButtonGroup
                exclusive
                value={priceType}
                onChange={(event, value) => {
                  if (value) {
                    setPriceType(value);
                  }
                }}
                fullWidth
              >
                <ToggleButton value="Market">Market</ToggleButton>
                <ToggleButton value="Limit">Limit</ToggleButton>
              </ToggleButtonGroup>
            </Stack>
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "flex-start", sm: "center" }}
            justifyContent="space-between"
            sx={{
              p: 2,
              borderRadius: 4,
              backgroundColor: alpha(colors.white, 0.04),
              border: `1px solid ${alpha(colors.white, 0.06)}`,
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography sx={{ color: "text.secondary", fontSize: "0.92rem" }}>
                Margin required: Rs. {marginRequired}
              </Typography>
              <RefreshIcon
                onClick={handleRefreshMargin}
                sx={{ color: accentColor, cursor: "pointer", fontSize: "1.15rem" }}
              />
            </Stack>
            <Stack direction="row" spacing={1.2} sx={{ width: { xs: "100%", sm: "auto" } }}>
              <Button onClick={handleClose} variant="outlined" fullWidth>
                Cancel
              </Button>
              <Button
                onClick={handleOnOrder}
                variant="contained"
                fullWidth
                sx={{
                  minWidth: 110,
                  background: `linear-gradient(135deg, ${accentColor} 0%, ${colors.brandDark} 100%)`,
                }}
              >
                {loading ? <Loading color="#fff" size={20} /> : orderType}
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
}
