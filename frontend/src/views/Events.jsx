import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import {
  Divider,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

import Table from "../components/Table";

const SOFTWARE_UPDATED = "SOFTWARE_UPDATED";
const CRITICAL_ERROR = "CRITICAL_ERROR";
const INCIDENT_REPORT_GENERATED = "INCIDENT_REPORT_GENERATED";

function Events() {
  const fetchEvents = async () => {
    const baseURL = "http://localhost:3001/events";
    const qsParams = new URLSearchParams({
      eventType: selectedEventType || "",
    });

    const endpoint = `${baseURL}?${qsParams.toString()}`;

    const res = await fetch(endpoint);
    return res.json();
  };

  const [selectedEventType, setSelectedEventType] = useState("");

  const { data, status, refetch } = useQuery("events", fetchEvents, {
    enabled: false,
  });

  useEffect(() => {
    refetch();
  }, [refetch, selectedEventType]);

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
        <h1 style={{ margin: "12px" }}>Events</h1>
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
              <p>Event Type</p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  maxWidth: "240px",
                }}
              >
                <FormControl sx={{ m: 1, minWidth: 400 }}>
                  <InputLabel id="demo-simple-select-autowidth-label">
                    Select Event Type
                  </InputLabel>

                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedEventType}
                    label="Select Event Type"
                    onChange={(e) => setSelectedEventType(e.target.value)}
                    variant="outlined"
                  >
                    <MenuItem value="">
                      <em>All Event Types</em>
                    </MenuItem>
                    <MenuItem value={SOFTWARE_UPDATED}>
                      {SOFTWARE_UPDATED}
                    </MenuItem>
                    <MenuItem value={CRITICAL_ERROR}>{CRITICAL_ERROR}</MenuItem>
                    <MenuItem value={INCIDENT_REPORT_GENERATED}>
                      {INCIDENT_REPORT_GENERATED}
                    </MenuItem>
                  </Select>
                </FormControl>
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
                "id",
                "device_serial_number",
                "event_type",
                "timestamp",
                "json_payload",
              ]}
              rows={data.data}
            />
          </div>
        )}
      </div>
    </Paper>
  );
}

export default Events;
