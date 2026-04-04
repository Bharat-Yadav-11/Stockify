import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import axios from "axios";
import Loading from "../loading/Loading";
import ExitModal from "../modals/ExitModal";
import { colors } from "../../theme/Theme";

function createData(posId, symbol, exchange, orderType, qty, avg, tradeType, lmType, ltp, pnl, posStatus) {
  return {
    posId,
    symbol,
    exchange,
    orderType: orderType.toUpperCase(),
    qty,
    avg,
    tradeType,
    lmType: lmType.toUpperCase(),
    ltp,
    pnl,
    posStatus,
  };
}

export default function PositionsTable() {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [orderType, setOrderType] = useState("");
  const [positionData, setPositionData] = useState("");

  const tableHeadCellSx = {
    py: 1.8,
    px: 2,
    fontSize: "0.8rem",
    letterSpacing: "0.08em",
  };

  const getPositions = async () => {
    const userId = JSON.parse(localStorage.getItem("cmUser"))?.userid;
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/position/all?userId=${userId}`);
      if (response.status === 200) {
        const allPositions = [];
        response.data?.positions?.forEach((position) => {
          allPositions.push(
            createData(
              position._id,
              position.buyOrderId.scripId.symbol,
              position.buyOrderId.scripId.exchange,
              position.buyOrderId.orderType,
              position.buyOrderId.qty,
              parseFloat(position.buyOrderId.price),
              position.buyOrderId.productType,
              position.buyOrderId.priceType,
              parseFloat(position.buyOrderId.scripId.lastPrice),
              position.buyOrderId.orderType.toLowerCase() === "buy"
                ? (parseFloat(position.buyOrderId.scripId.lastPrice) - parseFloat(position.buyOrderId.price)) * position.buyOrderId.qty
                : (parseFloat(position.buyOrderId.price) - parseFloat(position.buyOrderId.scripId.lastPrice)) * position.buyOrderId.qty,
              position.posStatus
            )
          );
        });
        setPositions(allPositions);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExitPosition = (position) => {
    setOpen(true);
    setOrderType(position.orderType.toLowerCase() === "buy" ? "Sell" : "Buy");
    setPositionData(position);
  };

  useEffect(() => {
    getPositions();
    const intervalId = setInterval(() => {
      getPositions();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 3,
        backgroundColor: alpha(colors.surfaceSoft, 0.55),
        maxHeight: 660,
        border: `1px solid ${alpha(colors.white, 0.08)}`,
      }}
    >
      <ExitModal orderType={orderType} open={open} setOpen={setOpen} positionData={positionData} />
      <Table sx={{ minWidth: 900 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={tableHeadCellSx}>Symbol</TableCell>
            <TableCell sx={tableHeadCellSx}>Product type</TableCell>
            <TableCell sx={tableHeadCellSx}>B/S</TableCell>
            <TableCell sx={tableHeadCellSx}>Exchange</TableCell>
            <TableCell sx={tableHeadCellSx}>Price type</TableCell>
            <TableCell sx={tableHeadCellSx} align="right">Qty</TableCell>
            <TableCell sx={tableHeadCellSx} align="right">Avg</TableCell>
            <TableCell sx={tableHeadCellSx} align="right">LTP</TableCell>
            <TableCell sx={tableHeadCellSx} align="right">P&amp;L</TableCell>
            <TableCell sx={tableHeadCellSx} align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={10}>
                <Box sx={{ py: 4 }}>
                  <Loading />
                </Box>
              </TableCell>
            </TableRow>
          ) : positions.length > 0 ? (
            positions.map((position) => {
              const isActive = position.posStatus.toLowerCase() === "active";
              const positive = position.pnl >= 0;
              return (
                <TableRow
                  key={position.posId}
                  hover
                  sx={{
                    "& td": { px: 2, py: 1.7 },
                    opacity: isActive ? 1 : 0.58,
                    backgroundColor: isActive ? "transparent" : alpha(colors.white, 0.03),
                  }}
                >
                  <TableCell sx={{ fontWeight: 700 }}>{position.symbol}</TableCell>
                  <TableCell>{position.tradeType}</TableCell>
                  <TableCell>
                    <Typography
                      sx={{
                        background: position.orderType.toLowerCase() === "buy" ? alpha(colors.info, 0.18) : alpha(colors.brand, 0.18),
                        color: position.orderType.toLowerCase() === "buy" ? colors.info : colors.brand,
                        textAlign: "center",
                        borderRadius: 1.5,
                        fontSize: "0.82rem",
                        padding: "0.28rem 0.75rem",
                        fontWeight: 700,
                      }}
                    >
                      {position.orderType}
                    </Typography>
                  </TableCell>
                  <TableCell>{position.exchange}</TableCell>
                  <TableCell>{position.lmType}</TableCell>
                  <TableCell align="right">{position.qty}</TableCell>
                  <TableCell align="right">{position.avg}</TableCell>
                  <TableCell align="right">{position.ltp}</TableCell>
                  <TableCell align="right" sx={{ color: positive ? colors.success : colors.danger, fontWeight: 700 }}>
                    {position.pnl}
                  </TableCell>
                  <TableCell align="right">
                    <Button onClick={() => handleExitPosition(position)} variant="outlined" disabled={!isActive}>
                      Exit
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={10}>
                <Typography sx={{ color: "text.secondary", py: 3, textAlign: "center" }}>No positions</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
