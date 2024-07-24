# RaySecur take home challenge

## About the challenge

RaySecur makes and manufactures the MailSecur device. Our devices are deployed all over the world, and manually inspecting each device is not always feasible.

For this exercise, you will be implementing a prototype device dashboard where you can view and analyze various data collected from our devices. The data in this example is simulated, but closely reflects real-world data that we collect. The example project is setup using Javascript, express, and sqlite (backend), and Javascript/react for the frontend. Feel free to swap out any library/framework if you would prefer to use something else, but remember to prioritize finishing a working prototype.

**We expect this challenge to take 2-3 hours total**, if you feel you need more time please let us know and we can discuss the situation.

### What we are looking for:
- extend the backend prototype
- extend the frontend prototype
- use git version control
- focus on delivering a working prototype


### We designed this challenge to:
- learn as much as we can about the way you work
- introduce you to the types of challenges you might encouter in this role.

## Project setup

This project is separated into two different folders, `backend` and `frontend`, node dependencies are managed seperately for each project folder.

To get started run:
```
cd backend && npm install
cd ..
cd frontend && npm install
```

then to start the application run:
`cd backend && npm run dev`
and in another terminal
`cd frontend && npm run dev`

**Note:** The database comes pre-seeded in the `backend/db/device-data.db` file. If you wish to modify the initial data:
1. make desired changes to `backend/db/seed-data.json`
2. delete file `backend/db/device-data.json`
3. run `npm run seed` in the `backend` directory

## Part 1: Extend the backend prototype

The included version of the prototype prototype only includes a simple `GET` endpoint that returns all data for each data type.

**Objectives:**
- implement filter parameters on the `GET` endpoint (i.e. a range of device serial numbers, events within a give time period, etc...)

**Bonus:**
- add authentication to access API

**Out of Scope:**
- since this is modeled after an IoT system, device data should be read-only. You do not need to worry about creating/updating device data.

### Database Diagram

``` mermaid
erDiagram
  DEVICE {
    TEXT serial_number PK
    TEXT ui_software_version
    TEXT camera_software_version
    TEXT make
    TEXT model
    TEXT version
    TEXT special_info
  }
  
  METRICS {
    INTEGER id PK
    TEXT device_serial_number FK
    INTEGER timestamp
    INTEGER snapshots_number
    INTEGER snapshots_size
    INTEGER recordings_number
    INTEGER recordings_size
    INTEGER incident_reports_number
    INTEGER incident_reports_size
    INTEGER disk_total
    INTEGER disk_used
    INTEGER disk_available
    INTEGER analytics_byte_size
    REAL hours_source_usage
    REAL hours_system_usage
  }
  
  EVENTS {
    INTEGER id PK
    TEXT device_serial_number FK
    TEXT event_type
    INTEGER timestamp
    TEXT json_payload
  }
  
  DEVICE ||--o{ METRICS : "has metrics"
  DEVICE ||--o{ EVENTS : "has events"
```

## Part 2: extend the frontend prototype

The frontend prototype is a very simple display of the available devices in the database. We want you to extend this so the user can get meaningful insights from the data.

**Objectives:**
- create a visualization for all data types available (device, metrics, events)
- Integrate filter parameters from backend into a UI element

**Bonus:**
- add user auth to frontend

**Out of Scope:**
- since this is modeled after an IoT system, device data should be read-only. You do not need to worry about creating/editing device data.

**Note:** the frontend essentially just the JS/react template from `npm create vite@latest`. The only modifications are: added react-query dependency, changed code in `App.jsx`. If you wish to use TypeScript you should be able to easily re-generate the app with your desired setup.
# security-scan-data-dashboard
