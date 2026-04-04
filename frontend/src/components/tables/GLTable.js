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

function createData(symbol, open, high, low, prevPrice, ltp, perChange, volume, value) {
  return {
    symbol,
    open,
    high,
    low,
    prevPrice,
    ltp,
    perChange,
    volume,
    value: value.toFixed(2),
  };
}

export default function GLTable({ type, refreshGL, setRefreshGL }) {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getGL = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/analysis/gl`);
      if (response.status === 200) {
        const glResponseData = response.data;
        let glData;
        if (glResponseData.gainers && type === "gainers") {
          glData = glResponseData.gainers[0].NIFTY.data;
        }
        if (glResponseData.losers && type === "losers") {
          glData = glResponseData.losers[0].NIFTY.data;
        }

        glData = glData?.map((scrip) =>
          createData(
            scrip.symbol,
            scrip.open_price,
            scrip.high_price,
            scrip.low_price,
            scrip.prev_price,
            scrip.ltp,
            scrip.perChange,
            scrip.trade_quantity,
            scrip.turnover
          )
        );
        setTableData(glData || []);
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
      alert("Something went wrong");
    }
  }, [type]);

  const refreshGainerLosers = useCallback(async () => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_BASE_URL}/analysis/gl/save`);
      if (response.status === 200) {
        getGL();
        setRefreshGL(false);
      }
    } catch (err) {
      console.log(err);
      setRefreshGL(false);
      alert("Something went wrong");
    }
  }, [getGL, setRefreshGL]);

  useEffect(() => {
    getGL();
  }, [getGL]);

  useEffect(() => {
    if (refreshGL) {
      refreshGainerLosers();
    }
  }, [refreshGL, refreshGainerLosers]);

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
      <Table stickyHeader sx={{ minWidth: 850 }}>
        <TableHead>
          <TableRow>
            <TableCell>Symbol</TableCell>
            <TableCell align="right">Open</TableCell>
            <TableCell align="right">High</TableCell>
            <TableCell align="right">Low</TableCell>
            <TableCell align="right">Prev. close</TableCell>
            <TableCell align="right">LTP</TableCell>
            <TableCell align="right">% Chng</TableCell>
            <TableCell align="right">Volume</TableCell>
            <TableCell align="right">Value (Rs. Lakhs)</TableCell>
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
          ) : tableData && tableData.length > 0 ? (
            tableData.map((scrip) => (
              <TableRow
                key={scrip.symbol}
                hover
                sx={{
                  "&:hover": {
                    backgroundColor: alpha(colors.white, 0.03),
                  },
                }}
              >
                <TableCell sx={{ fontWeight: 700 }}>{scrip.symbol}</TableCell>
                <TableCell align="right">{scrip.open}</TableCell>
                <TableCell align="right">{scrip.high}</TableCell>
                <TableCell align="right">{scrip.low}</TableCell>
                <TableCell align="right">{scrip.prevPrice}</TableCell>
                <TableCell align="right">{scrip.ltp}</TableCell>
                <TableCell
                  align="right"
                  sx={{ color: type === "gainers" ? colors.success : colors.danger, fontWeight: 700 }}
                >
                  {scrip.perChange}%
                </TableCell>
                <TableCell align="right">{scrip.volume}</TableCell>
                <TableCell align="right">{scrip.value}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9}>
                <Typography sx={{ color: "text.secondary", py: 3, textAlign: "center" }}>
                  No data found.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
