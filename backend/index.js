import express from "express";

import { getCoils, createCoil } from "./src/db.js"

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/coils", async (req, res) => {
    const coils = await getCoils();
    res.status(200).json(coils)
});

app.post("/coils", async (req, res) => {
    const { type, size, warehouse } = req.body;
    const createdCoil = await createCoil({ type, size, warehouse });
    res.status(201).json(createdCoil);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`)
});