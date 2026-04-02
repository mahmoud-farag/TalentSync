/*
  Warnings:

  - You are about to drop the column `database_url` on the `companies` table. All the data in the column will be lost.
  - Added the required column `db_name` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `host_name` to the `companies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "companies" DROP COLUMN "database_url",
ADD COLUMN     "db_name" TEXT NOT NULL,
ADD COLUMN     "host_name" TEXT NOT NULL;
