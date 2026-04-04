import React, { useState } from "react";
import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
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

export default function ExitModal({ orderType, open, setOpen, positionData }) {
  const [productType, setProductType] = useState("");
  const [priceType, setPriceType] = useState("");
  const [qty, setQty] = useState("1");
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);

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
      userId: JSON.parse(localStorage.getItem("cmUser")).userid,
      posId: positionData.posId,
      priceType: priceType,
      productType: productType,
      avgPrice: positionData.ltp,
      qty: qty,
    };

    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/stock/exit/${orderType.toLowerCase() === "sell" ? "buy" : "sell"}`,
        data
      );
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
              {orderType} {positionData?.symbol}
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>
              {positionData?.exchange}: Rs. {positionData?.ltp}
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

          <Stack direction="row" spacing={1.2} justifyContent="flex-end">
            <Button onClick={handleClose} variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={handleOnOrder}
              variant="contained"
              sx={{
                minWidth: 110,
                background: `linear-gradient(135deg, ${accentColor} 0%, ${colors.brandDark} 100%)`,
              }}
            >
              {loading ? <Loading color="#fff" size={20} /> : orderType}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Modal>
  );
}
