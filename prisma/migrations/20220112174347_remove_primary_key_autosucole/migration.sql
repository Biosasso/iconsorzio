/*
  Warnings:

  - The primary key for the `autoscuole` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "autoscuole" DROP CONSTRAINT "autoscuole_pkey",
ALTER COLUMN "consorzio_toggle" SET DEFAULT true,
ADD CONSTRAINT "autoscuole_pkey" PRIMARY KEY ("id");
