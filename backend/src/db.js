import { PrismaClient } from "../generated/prisma/index.js";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Funções para bobinas
export async function getCoils() {
    const bobinas = await prisma.coil.findMany({
        include: {
            createdBy: {
                select: { id: true, username: true, name: true }
            }
        }
    })
    return bobinas;
}

export async function createCoil({ type, size, warehouse, createdById }) {
    const coil = await prisma.coil.create({
      data: {
        type: type,
        size: size,
        warehouse: warehouse,
        createdById: createdById
      },
      include: {
        createdBy: {
            select: { id: true, username: true, name: true }
        }
      }
    });

    return coil;
}

// Funções para usuários
export async function createUser({ username, name, password, role = 'OPERADOR' }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
        data: {
            username,
            name,
            password: hashedPassword,
            role
        },
        select: { id: true, username: true, name: true, role: true, createdAt: true }
    });

    return user;
}

export async function getUserByUsername(username) {
    const user = await prisma.user.findUnique({
        where: { username }
    });
    return user;
}

export async function validateUserPassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
}