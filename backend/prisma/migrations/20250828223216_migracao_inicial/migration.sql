-- CreateEnum
CREATE TYPE "public"."Warehouse" AS ENUM ('A', 'B');

-- CreateEnum
CREATE TYPE "public"."Type" AS ENUM ('t20cm', 't40cm');

-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('OPERADOR', 'GERENTE');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'OPERADOR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Coil" (
    "id" SERIAL NOT NULL,
    "type" "public"."Type" NOT NULL,
    "size" DOUBLE PRECISION NOT NULL,
    "warehouse" "public"."Warehouse" NOT NULL,
    "manufactureDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER,

    CONSTRAINT "Coil_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- AddForeignKey
ALTER TABLE "public"."Coil" ADD CONSTRAINT "Coil_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
