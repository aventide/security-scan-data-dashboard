import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { Divider, Paper, TextField } from "@mui/material";

import Table from "../components/Table";

function Metrics() {
  const fetchMetrics = async () => {
    const baseURL = "http://localhost:3001/metrics";
    const qsParams = new URLSearchParams({
      minRecordings: minRecordings || 0,
    });

    const endpoint = `${baseURL}?${qsParams.toString()}`;

    const res = await fetch(endpoint);
    return res.json();
  };

  const [minRecordings, setMinRecordings] = useState(0);

  const { data, status, refetch } = useQuery("metrics", fetchMetrics, {
    enabled: false,
  });

  useEffect(() => {
    refetch();
  }, [refetch, minRecordings]);

  return (
    <Paper>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          width: "100%",
          textAlign: "center",
        }}
      >
        <h1 style={{ margin: "12px" }}>Metrics</h1>
        <div
          style={{
            margin: "12px",
            display: "flex",
            flexDirection: "column",
            width: "100%",
            textAlign: "left",
            marginBottom: "40px",
          }}
        >
          <h2 style={{ fontWeight: "bold" }}>Filters</h2>
          <div
            style={{
              flex: 1,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
            }}
          >
            <div>
              <p>Minimum number of recordings</p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  maxWidth: "240px",
                }}
              >
                <TextField
                  size="small"
                  inputProps={{ maxLength: 8 }}
                  sx={{ width: 120 }}
                  onChange={(e) => setMinRecordings(e.target.value)}
                  type="number"
                  InputProps={{ inputProps: { min: 0, max: 1000 } }}
                  value={minRecordings}
                />
              </div>
            </div>
            <div></div>
            <div></div>
          </div>
        </div>
        {status === "error" && (
          <p style={{ color: "red" }}>Error fetching data</p>
        )}
        {status === "loading" && <p>Fetching data...</p>}
        {status === "success" && (
          <div style={{ width: "100%" }}>
            <Divider />
            <Table
              columns={[
                "analytics_byte_size",
                "device_serial_number",
                "disk_available",
                "disk_total",
                "disk_used",
                "hours_source_usage",
                "hours_system_usage",
                "id",
                "incident_reports_number",
                "incident_reports_size",
                "recordings_number",
                "recordings_size",
                "snapshots_number",
                "snapshots_size",
              ]}
              rows={data.data}
            />
          </div>
        )}
      </div>
    </Paper>
  );
}

export default Metrics;
