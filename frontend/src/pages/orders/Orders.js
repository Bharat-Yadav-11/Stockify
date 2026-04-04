import { Box, Button, Tab, Tabs } from "@mui/material";
import React, { useState } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import OrdersTable from "../../components/tables/OrdersTable";
import PageHeader from "../../components/ui/PageHeader";

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 2.5 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `orders-tab-${index}`,
    "aria-controls": `orders-tabpanel-${index}`,
  };
}

function Orders() {
  const [value, setValue] = useState(0);
  const [refresh, setRefresh] = useState(false);

  return (
    <Box>
      <PageHeader
        eyebrow="Execution"
        title="Orders and status flow"
        description="Review open and executed orders in a cleaner, high-contrast layout built for fast scanning."
        action={
          <Button onClick={() => setRefresh(true)} variant="outlined" startIcon={<RefreshIcon />}>
            Refresh orders
          </Button>
        }
      />

      <Box>
        <Tabs value={value} onChange={(event, newValue) => setValue(newValue)} textColor="inherit">
          <Tab label="Open orders" {...a11yProps(0)} />
          <Tab label="Executed orders" {...a11yProps(1)} />
        </Tabs>
        <TabPanel value={value} index={0}>
          <OrdersTable status="Open" refresh={refresh} setRefresh={setRefresh} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <OrdersTable status="Executed" refresh={refresh} setRefresh={setRefresh} />
        </TabPanel>
      </Box>
    </Box>
  );
}

export default Orders;
