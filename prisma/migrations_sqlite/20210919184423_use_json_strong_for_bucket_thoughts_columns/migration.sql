/*
  Warnings:

  - You are about to drop the `Column` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Thought` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Column";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Thought";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Bucket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "data" TEXT NOT NULL DEFAULT '{ "columns": [] }',
    CONSTRAINT "Bucket_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Bucket" ("createdAt", "id", "name", "ownerId") SELECT "createdAt", "id", "name", "ownerId" FROM "Bucket";
DROP TABLE "Bucket";
ALTER TABLE "new_Bucket" RENAME TO "Bucket";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
