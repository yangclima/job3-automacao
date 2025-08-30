import express from "express";
import cors from "cors";
import { PrismaClient } from "./generated/prisma/index.js";

import { getCoils, createCoil, createUser, getUserByUsername, validateLogin } from "./infra/db.js"

const app = express();
const prisma = new PrismaClient();
const PORT = 3001;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: false
}));

app.use(express.json());

app.post("/register", async (req, res) => {
    try {
        const { username, name, password, role } = req.body;

        if (!username || !name || !password) {
            return res.status(400).json({ error: "Username, nome e senha são obrigatórios" });
        }

        // Verifica se o usuário já existe
        const existingUser = await getUserByUsername(username);
        if (existingUser) {
            return res.status(409).json({ error: "Username já está em uso" });
        }

        const user = await createUser({ username, name, password, role });

        res.status(201).json({ user });
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        res.status(error.status || 500).json({ error: error.HTTPmessage || "Internal server error" });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username e senha são obrigatórios" });
        }

        const user = await validateLogin(username, password);
        
        if (!user) {
            return res.status(401).json({ error: "Credenciais inválidas" });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error("Erro no login:", error);
        res.status(error.status || 500).json({ error: error.HTTPmessage || "Internal server error" });
    }
});

app.get("/users", async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { 
                id: true, 
                username: true, 
                name: true, 
                role: true, 
                createdAt: true,
                _count: {
                    select: { coils: true }
                }
            }
        });
        res.status(200).json(users);
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        res.status(error.status || 500).json({ error: error.HTTPmessage || "Internal server error" });
    }
});

app.get("/coils", async (req, res) => {
    try {
        const coils = await getCoils();
        res.status(200).json(coils);
    } catch (error) {
        console.error("Erro ao buscar bobina:", error);
        res.status(error.status || 500).json({ error: error.HTTPmessage || "Internal server error" });
    }
});

app.post("/coils", async (req, res) => {
    try {
        const { type, size, warehouse, createdById } = req.body;
        
        if (!type || !size || !warehouse || !createdById) {
            return res.status(400).json({ error: "Tipo, tamanho, armazém e usuário são obrigatórios" });
        }

        const createdCoil = await createCoil({ type, size, warehouse, createdById });

        if(createdCoil.error){
            return res.status(400).json(createdCoil);
        }

        res.status(201).json(createdCoil);
    } catch (error) {
        console.error("Erro ao criar bobina:", error);
        res.status(error.status || 500).json({ error: error.HTTPmessage || "Internal server error" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`)
});