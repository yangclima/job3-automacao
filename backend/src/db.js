import { PrismaClient } from "../generated/prisma/index.js";
const prisma = new PrismaClient();

export async function getCoils() {
    const bobinas = await prisma.coil.findMany()
    return bobinas;
}

export async function createCoil({ type, size, warehouse }) {
    const coil = await prisma.coil.create({
      data: {
        type: type,
        size: size,
        warehouse: warehouse
      }
    });

    return coil;
}