import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
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
import { colors } from "../../theme/Theme";

function createData(orderId, time, symbol, exchange, orderType, qty, avg, tradeType, lmType, status) {
  const date = new Date(time);
  const formattedTime =
    date.getHours() + ":" + (date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()) + ":" + date.getSeconds();
  return {
    orderId,
    time: formattedTime,
    symbol,
    exchange,
    orderType: orderType.toUpperCase(),
    qty,
    avg,
    tradeType,
    lmType,
    status: status.toUpperCase(),
  };
}

export default function OrdersTable({ status, refresh, setRefresh }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const tableHeadCellSx = {
    py: 1.8,
    px: 2,
    fontSize: "0.8rem",
    letterSpacing: "0.08em",
  };

  const getOrders = useCallback(async () => {
    const userId = JSON.parse(localStorage.getItem("cmUser")).userid;
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/order/all?userId=${userId}&status=${status}`);
      if (response.status === 200) {
        setLoading(false);
        setRefresh(false);
        const allOrders = [];
        response.data.orders.forEach((order) => {
          allOrders.push(
            createData(
              order._id,
              order.createdAt,
              order.scripId.symbol,
              order.scripId.exchange,
              order.orderType,
              order.qty,
              order.price,
              order.productType,
              order.priceType,
              order.orderStatus
            )
          );
        });
        setOrders(allOrders);
      }
    } catch (err) {
      console.log(err);
      alert("Something went wrong");
      setLoading(false);
    }
  }, [setRefresh, status]);

  useEffect(() => {
    getOrders();
  }, [getOrders]);

  useEffect(() => {
    if (refresh) {
      getOrders();
    }
  }, [getOrders, refresh]);

  return (
    <TableContainer
      component={Paper}
      sx={{
        borderRadius: 3,
        backgroundColor: alpha(colors.surfaceSoft, 0.55),
        maxHeight: 620,
        border: `1px solid ${alpha(colors.white, 0.08)}`,
      }}
    >
      <Table sx={{ minWidth: 900 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={tableHeadCellSx}>Time</TableCell>
            <TableCell sx={tableHeadCellSx}>Order type</TableCell>
            <TableCell sx={tableHeadCellSx}>Symbol</TableCell>
            <TableCell sx={tableHeadCellSx}>Exchange</TableCell>
            <TableCell sx={tableHeadCellSx} align="right">Qty</TableCell>
            <TableCell sx={tableHeadCellSx} align="right">Avg</TableCell>
            <TableCell sx={tableHeadCellSx}>Product type</TableCell>
            <TableCell sx={tableHeadCellSx}>Price type</TableCell>
            <TableCell sx={tableHeadCellSx}>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={9}>
                <Box sx={{ py: 4 }}>
                  <Loading />
                </Box>
              </TableCell>
            </TableRow>
          ) : orders.length > 0 ? (
            orders.map((order) => (
              <TableRow key={order.orderId} hover sx={{ "& td": { px: 2, py: 1.7 } }}>
                <TableCell>{order.time}</TableCell>
                <TableCell sx={{ minWidth: 132 }}>
                  <Typography
                    sx={{
                      background: order.orderType.toLowerCase() === "buy" ? alpha(colors.info, 0.18) : alpha(colors.brand, 0.18),
                      color: order.orderType.toLowerCase() === "buy" ? colors.info : colors.brand,
                      textAlign: "center",
                      borderRadius: 1.5,
                      fontSize: "0.82rem",
                      padding: "0.28rem 0.75rem",
                      fontWeight: 700,
                    }}
                  >
                    {order.orderType}
                  </Typography>
                </TableCell>
                <TableCell sx={{ fontWeight: 700 }}>{order.symbol}</TableCell>
                <TableCell>{order.exchange}</TableCell>
                <TableCell align="right">{order.qty}</TableCell>
                <TableCell align="right">{order.avg}</TableCell>
                <TableCell>{order.tradeType}</TableCell>
                <TableCell>{order.lmType}</TableCell>
                <TableCell sx={{ minWidth: 132 }}>
                  <Typography
                    sx={{
                      background: order.status.toLowerCase() === "executed" ? alpha(colors.success, 0.18) : alpha(colors.warning, 0.18),
                      color: order.status.toLowerCase() === "executed" ? colors.success : colors.warning,
                      textAlign: "center",
                      borderRadius: 1.5,
                      fontSize: "0.82rem",
                      padding: "0.28rem 0.75rem",
                      fontWeight: 700,
                    }}
                  >
                    {order.status}
                  </Typography>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9}>
                <Typography sx={{ color: "text.secondary", py: 3, textAlign: "center" }}>No orders</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
