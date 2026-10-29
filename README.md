# CampusFix2.0

CampusFix2.0 is a campus infrastructure damage reporting and management system.

## Technology stack

- React with Vite
- JavaScript
- CSS
- Node.js
- Express.js
- MongoDB Community Server
- Mongoose
- REST API

## Project structure

- `client/` contains the React frontend.
- `server/` contains the Express backend.
- `server/src/` contains backend source code.

## Run the backend

Open PowerShell in the `server` folder:

```powershell
npm install
npm run dev
## Database

CampusFix2.0 uses MongoDB Community Server locally.

The local connection string is:

```env
MONGO_URI=mongodb://127.0.0.1:27017/campusfix2

## Run the frontend

Open PowerShell in the `client` folder:

```powershell
npm install
npm run dev
## Create report workflow

The React frontend submits new reports through:

```text
POST /api/reports
