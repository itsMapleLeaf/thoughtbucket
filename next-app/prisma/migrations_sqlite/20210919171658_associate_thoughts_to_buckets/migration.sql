/*
  Warnings:

  - Added the required column `bucketId` to the `Thought` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Thought" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "text" TEXT NOT NULL,
    "bucketId" TEXT NOT NULL,
    "columnId" TEXT NOT NULL,
    CONSTRAINT "Thought_bucketId_fkey" FOREIGN KEY ("bucketId") REFERENCES "Bucket" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Thought_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "Column" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Thought" ("columnId", "createdAt", "id", "text") SELECT "columnId", "createdAt", "id", "text" FROM "Thought";
DROP TABLE "Thought";
ALTER TABLE "new_Thought" RENAME TO "Thought";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
