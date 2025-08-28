-- CreateEnum
CREATE TYPE "public"."Warehouse" AS ENUM ('A', 'B');

-- CreateEnum
CREATE TYPE "public"."Type" AS ENUM ('t20cm', 't40cm');

-- CreateTable
CREATE TABLE "public"."Coil" (
    "id" SERIAL NOT NULL,
    "type" "public"."Type" NOT NULL,
    "size" DOUBLE PRECISION NOT NULL,
    "warehouse" "public"."Warehouse" NOT NULL,
    "manufactureDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Coil_pkey" PRIMARY KEY ("id")
);
