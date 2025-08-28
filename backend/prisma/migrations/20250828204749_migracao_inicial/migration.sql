-- CreateEnum
CREATE TYPE "public"."armazem" AS ENUM ('A', 'B');

-- CreateEnum
CREATE TYPE "public"."tipo" AS ENUM ('t20cm', 't40cm');

-- CreateTable
CREATE TABLE "public"."Bobina" (
    "id" SERIAL NOT NULL,
    "tipo" "public"."tipo" NOT NULL,
    "metros" DOUBLE PRECISION NOT NULL,
    "armazem" "public"."armazem" NOT NULL,

    CONSTRAINT "Bobina_pkey" PRIMARY KEY ("id")
);
