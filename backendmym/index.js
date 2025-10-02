import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import geoRoutes from "./routes/geo.js";
dotenv.config();

const app = express();


// other middlewares...


app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use("/geo", geoRoutes);
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});