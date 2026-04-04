import { Box, Button, Grid, Stack, TextField, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import React, { useState } from "react";
import PageHeader from "../../components/ui/PageHeader";
import SurfaceCard from "../../components/ui/SurfaceCard";
import { colors } from "../../theme/Theme";

const getRoundFloat = (num) => Math.round(num * 100) / 100;

function TradeCalculatorCard({ title, accent, values, setters, onRefresh }) {
  return (
    <SurfaceCard
      sx={{
        height: "100%",
        background: `linear-gradient(180deg, ${alpha(accent, 0.14)} 0%, ${alpha(colors.surface, 0.94)} 100%)`,
      }}
    >
      <Stack spacing={2.2}>
        <Stack spacing={0.6}>
          <Typography variant="h5">{title}</Typography>
          <Typography sx={{ color: "text.secondary" }}>
            Configure trade assumptions and refresh the derived risk metrics below.
          </Typography>
        </Stack>

        <Grid container spacing={1.5}>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Available margin" value={values.margin} onChange={(e) => setters.setMargin(e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Leverage" value={values.leverage} onChange={(e) => setters.setLeverage(e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Entry price" value={values.entryPrice} onChange={(e) => setters.setEntryPrice(e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Risk (pts)" value={values.risk} onChange={(e) => setters.setRisk(e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Reward (RR)" value={values.reward} onChange={(e) => setters.setReward(e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Qty" value={Math.floor(values.qty)} InputProps={{ readOnly: true }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Stop loss" value={values.stopLoss} InputProps={{ readOnly: true }} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Target" value={values.target} InputProps={{ readOnly: true }} />
          </Grid>
        </Grid>

        <Grid container spacing={1.5}>
          <Grid item xs={12} sm={6}>
            <Box
              sx={{
                p: 2,
                borderRadius: 4,
                backgroundColor: alpha(colors.success, 0.12),
                border: `1px solid ${alpha(colors.success, 0.24)}`,
              }}
            >
              <Typography sx={{ color: colors.success, fontWeight: 700, mb: 0.4 }}>Potential gain</Typography>
              <Typography variant="h6">Rs. {getRoundFloat(values.gain)}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box
              sx={{
                p: 2,
                borderRadius: 4,
                backgroundColor: alpha(colors.danger, 0.12),
                border: `1px solid ${alpha(colors.danger, 0.24)}`,
              }}
            >
              <Typography sx={{ color: colors.danger, fontWeight: 700, mb: 0.4 }}>Potential loss</Typography>
              <Typography variant="h6">Rs. {getRoundFloat(values.loss)}</Typography>
            </Box>
          </Grid>
        </Grid>

        <Stack direction="row" justifyContent="flex-end">
          <Button onClick={onRefresh} variant="contained" sx={{ minWidth: 150, background: accent }}>
            Refresh
          </Button>
        </Stack>
      </Stack>
    </SurfaceCard>
  );
}

function Tools() {
  const [buyMargin, setBuyMargin] = useState(5000);
  const [sellMargin, setSellMargin] = useState(5000);
  const [buyLeverage, setBuyLeverage] = useState(5);
  const [sellLeverage, setSellLeverage] = useState(5);
  const [buyEntryPrice, setBuyEntryPrice] = useState(1000.5);
  const [sellEntryPrice, setSellEntryPrice] = useState(1000.5);
  const [buyRisk, setBuyRisk] = useState(10);
  const [sellRisk, setSellRisk] = useState(10);
  const [buyReward, setBuyReward] = useState(2);
  const [sellReward, setSellReward] = useState(2);
  const [buyQty, setBuyQty] = useState((buyLeverage * buyMargin) / buyEntryPrice);
  const [sellQty, setSellQty] = useState((sellLeverage * sellMargin) / sellEntryPrice);
  const [buyStopLoss, setBuyStopLoss] = useState(buyEntryPrice - buyRisk);
  const [sellStopLoss, setSellStopLoss] = useState(sellEntryPrice + sellRisk);
  const [buyTarget, setBuyTarget] = useState(buyEntryPrice + buyRisk * buyReward);
  const [sellTarget, setSellTarget] = useState(sellEntryPrice - sellRisk * sellReward);
  const [buyGain, setBuyGain] = useState(Math.floor(buyQty) * (buyTarget - buyEntryPrice));
  const [sellGain, setSellGain] = useState(Math.floor(sellQty) * (sellEntryPrice - sellTarget));
  const [buyLoss, setBuyLoss] = useState(Math.floor(buyQty) * (buyEntryPrice - buyStopLoss));
  const [sellLoss, setSellLoss] = useState(Math.floor(sellQty) * (sellStopLoss - sellEntryPrice));

  const handleBuyRefresh = () => {
    const nextQty = (buyLeverage * buyMargin) / buyEntryPrice;
    const nextStopLoss = buyEntryPrice - buyRisk;
    const nextTarget = parseFloat(buyEntryPrice) + buyRisk * buyReward;
    setBuyQty(nextQty);
    setBuyStopLoss(nextStopLoss);
    setBuyTarget(nextTarget);
    setBuyGain(Math.floor(nextQty) * (nextTarget - buyEntryPrice));
    setBuyLoss(Math.floor(nextQty) * (buyEntryPrice - nextStopLoss));
  };

  const handleSellRefresh = () => {
    const nextQty = (sellLeverage * sellMargin) / sellEntryPrice;
    const nextStopLoss = parseFloat(sellEntryPrice) + parseFloat(sellRisk);
    const nextTarget = parseFloat(sellEntryPrice) - sellRisk * sellReward;
    setSellQty(nextQty);
    setSellStopLoss(nextStopLoss);
    setSellTarget(nextTarget);
    setSellGain(Math.floor(nextQty) * (sellEntryPrice - nextTarget));
    setSellLoss(Math.floor(nextQty) * (nextStopLoss - sellEntryPrice));
  };

  return (
    <Box>
      <PageHeader
        eyebrow="Risk Lab"
        title="Risk management calculator"
        description="A more focused planning view for sizing buy and sell setups while keeping the same underlying calculation flow."
      />

      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={6}>
          <TradeCalculatorCard
            title="Buy setup"
            accent={colors.info}
            values={{
              margin: buyMargin,
              leverage: buyLeverage,
              entryPrice: buyEntryPrice,
              risk: buyRisk,
              reward: buyReward,
              qty: buyQty,
              stopLoss: buyStopLoss,
              target: buyTarget,
              gain: buyGain,
              loss: buyLoss,
            }}
            setters={{
              setMargin: setBuyMargin,
              setLeverage: setBuyLeverage,
              setEntryPrice: setBuyEntryPrice,
              setRisk: setBuyRisk,
              setReward: setBuyReward,
            }}
            onRefresh={handleBuyRefresh}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <TradeCalculatorCard
            title="Sell setup"
            accent={colors.brand}
            values={{
              margin: sellMargin,
              leverage: sellLeverage,
              entryPrice: sellEntryPrice,
              risk: sellRisk,
              reward: sellReward,
              qty: sellQty,
              stopLoss: sellStopLoss,
              target: sellTarget,
              gain: sellGain,
              loss: sellLoss,
            }}
            setters={{
              setMargin: setSellMargin,
              setLeverage: setSellLeverage,
              setEntryPrice: setSellEntryPrice,
              setRisk: setSellRisk,
              setReward: setSellReward,
            }}
            onRefresh={handleSellRefresh}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default Tools;
