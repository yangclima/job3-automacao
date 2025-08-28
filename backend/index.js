import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());


const db = {
        bobinas: {
            1: {
                tipo: "40cm",
                metros: 29,
                armazem: "A"
            },
            2: {
                tipo: "20cm",
                metros: 23,
                armazem: "B"
            }
        }
}

let id = Object.keys(db.bobinas).length + 1

app.get("/bobinas", (req, res) => {
    res.json(db.bobinas)
});

app.post("/bobinas", (req, res) => {
    const {tipo, metros, armazem} = req.body;
    db.bobinas[id] = {tipo, metros, armazem};
    res.status(201).json({ id, ...db.bobinas[id] });
    id = id + 1;

});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`)
});