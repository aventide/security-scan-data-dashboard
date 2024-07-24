const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

const dbPath = path.resolve(__dirname, "device-data.db");
const seedDataPath = path.resolve(__dirname, "seed-data.json");

const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, async (err) => {
  if (err && err.code === "SQLITE_CANTOPEN") {
    await createDatabase();
    return;
  } else if (err) {
    console.error(`[DB ERROR]: ${err.message}`);
    exit(1);
  }
  console.log("Connected to the device-data database");
});

async function createDatabase() {
  const newdb = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
  await createTables(newdb);
  await checkSeedData(newdb);
}

async function createTables(db) {
  await db.run(`
    CREATE TABLE IF NOT EXISTS device (
      serial_number TEXT PRIMARY KEY,
      ui_software_version TEXT,
      camera_software_version TEXT,
      make TEXT,
      model TEXT,
      version TEXT,
      special_info TEXT
    )
  `);

  await db.run(`
    CREATE TABLE IF NOT EXISTS metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      device_serial_number TEXT,
      timestamp INTEGER,
      snapshots_number INTEGER,
      snapshots_size INTEGER,
      recordings_number INTEGER,
      recordings_size INTEGER,
      incident_reports_number INTEGER,
      incident_reports_size INTEGER,
      disk_total INTEGER,
      disk_used INTEGER,
      disk_available INTEGER,
      analytics_byte_size INTEGER,
      hours_source_usage REAL,
      hours_system_usage REAL,
      FOREIGN KEY (device_serial_number) REFERENCES device(serial_number)
    )
  `);

  await db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      device_serial_number TEXT,
      event_type TEXT CHECK(event_type IN ('SOFTWARE_UPDATED', 'INCIDENT_REPORT_GENERATED', 'CRITICAL_ERROR')),
      timestamp INTEGER,
      json_payload TEXT,
      FOREIGN KEY (device_serial_number) REFERENCES device(serial_number)
    )
  `);
}

async function checkSeedData(db) {
  const row = await db.get("SELECT COUNT(*) as count FROM device");
  if (row.count === 0) {
    console.log("Seeding database...");
    await seedDatabase(db);
  }
}

async function seedDatabase(db) {
  const seedData = JSON.parse(fs.readFileSync(seedDataPath, "utf8"));
  const { devices, metrics, events } = seedData;

  devices.forEach(async (device) => {
    await db.run(
      `INSERT INTO device (serial_number, ui_software_version, camera_software_version, make, model, version, special_info) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        device.serial_number,
        device.ui_software_version,
        device.camera_software_version,
        device.make,
        device.model,
        device.version,
        device.special_info,
      ]
    );
  });

  metrics.forEach(async (metric) => {
    await db.run(
      `INSERT INTO metrics (device_serial_number, timestamp, snapshots_number, snapshots_size, recordings_number, recordings_size, incident_reports_number, incident_reports_size, disk_total, disk_used, disk_available, analytics_byte_size, hours_source_usage, hours_system_usage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        metric.device_serial_number,
        metric.timestamp,
        metric.snapshots_number,
        metric.snapshots_size,
        metric.recordings_number,
        metric.recordings_size,
        metric.incident_reports_number,
        metric.incident_reports_size,
        metric.disk_total,
        metric.disk_used,
        metric.disk_available,
        metric.analytics_byte_size,
        metric.hours_source_usage,
        metric.hours_system_usage,
      ]
    );
  });

  events.forEach(async (event) => {
    await db.run(
      `INSERT INTO events (device_serial_number, event_type, timestamp, json_payload) VALUES (?, ?, ?, ?)`,
      [
        event.device_serial_number,
        event.event_type,
        event.timestamp,
        event.json_payload,
      ]
    );
  });

  console.log("Database seeded successfully.");
}

module.exports = db;
