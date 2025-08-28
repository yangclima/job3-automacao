import express from "express";
import { PrismaClient } from "./generated/prisma/index.js";

import { getCoils, createCoil, createUser, getUserByUsername, validateUserPassword } from "./src/db.js"
import { generateToken, authenticateToken, requireManager } from "./src/auth.js";

const app = express();
const prisma = new PrismaClient();
const PORT = 3000;

app.use(express.json());

// Rotas de autenticação
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
        const token = generateToken(user);

        res.status(201).json({ user, token });
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username e senha são obrigatórios" });
        }

        const user = await getUserByUsername(username);
        if (!user) {
            return res.status(401).json({ error: "Credenciais inválidas" });
        }

        const isValidPassword = await validateUserPassword(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: "Credenciais inválidas" });
        }

        const token = generateToken(user);
        const { password: _, ...userWithoutPassword } = user;

        res.status(200).json({ user: userWithoutPassword, token });
    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

// Rota para listar usuários (apenas gerentes)
app.get("/users", authenticateToken, requireManager, async (req, res) => {
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
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

// Rotas de bobinas (protegidas por autenticação)
app.get("/coils", authenticateToken, async (req, res) => {
    try {
        const coils = await getCoils();
        res.status(200).json(coils);
    } catch (error) {
        console.error("Erro ao buscar bobinas:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

app.post("/coils", authenticateToken, async (req, res) => {
    try {
        const { type, size, warehouse } = req.body;
        const createdById = req.user.id;
        
        if (!type || !size || !warehouse) {
            return res.status(400).json({ error: "Tipo, tamanho e armazém são obrigatórios" });
        }

        const createdCoil = await createCoil({ type, size, warehouse, createdById });
        res.status(201).json(createdCoil);
    } catch (error) {
        console.error("Erro ao criar bobina:", error);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}...`)
});