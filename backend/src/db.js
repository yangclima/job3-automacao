import { PrismaClient } from "../generated/prisma/index.js";

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

// Funções para usuários (simplificadas)
export async function createUser({ username, name, password, role = 'OPERADOR' }) {
    const user = await prisma.user.create({
        data: {
            username,
            name,
            password, // Senha em texto plano
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

export async function validateLogin(username, password) {
    const user = await prisma.user.findUnique({
        where: { username }
    });
    
    if (!user || user.password !== password) {
        return null;
    }
    
    // Retorna o usuário sem a senha
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
}