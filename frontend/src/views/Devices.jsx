import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { Divider, Paper, TextField } from "@mui/material";

import Table from "../components/Table";

function Devices() {
  
  const fetchDevices = async () => {

    const baseURL = "http://localhost:3001/devices"
    const qsParams = new URLSearchParams({
      serialStart: serialStart || '',
      serialEnd: serialEnd || ''
    });

    const endpoint = `${baseURL}?${qsParams.toString()}`;

    const res = await fetch(endpoint);
    return res.json();
  };

  const [serialStart, setSerialStart] = useState(''); 
  const [serialEnd, setSerialEnd] = useState(''); 
  
  const { data, status, refetch } = useQuery("devices", fetchDevices, {
    enabled: false,
  });

  useEffect(() => {
    refetch();
  }, [refetch, serialStart, serialEnd])

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
        <h1 style={{ margin: "12px" }}>Devices</h1>
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
              <p>Serial Range</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "240px" }}>
                <TextField
                  size="small"
                  inputProps={{ maxLength: 8 }}
                  sx={{width: 120}}
                  onChange={e => setSerialStart(e.target.value)}
                />
                <p style={{marginInline: '10px'}}>to</p>
                <TextField
                  size="small"
                  inputProps={{ maxLength: 8 }}
                  sx={{width: 120}}
                  onChange={e => setSerialEnd(e.target.value)}
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
                "serial_number",
                "ui_software_version",
                "camera_software_version",
                "make",
                "model",
                "version",
                "special_info",
              ]}
              rows={data.data}
              primaryKey="serial_number"
            />
          </div>
        )}
      </div>
    </Paper>
  );
}

export default Devices;
