import { Box } from "@mui/material";
import React from "react";
import PositionsTable from "../../components/tables/PositionsTable";
import PageHeader from "../../components/ui/PageHeader";

function Positions() {
  return (
    <Box>
      <PageHeader
        eyebrow="Exposure"
        title="Open positions and live P&L"
        description="Monitor current exposure, scan unrealized profit and loss, and exit active positions from a tighter workspace."
      />
      <PositionsTable />
    </Box>
  );
}

export default Positions;
