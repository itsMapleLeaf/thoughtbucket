-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL
);
INSERT INTO "new_User" ("email", "id", "name", "passwordHash") SELECT "email", "id", "name", "passwordHash" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "new_Column" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "bucketId" TEXT NOT NULL,
    CONSTRAINT "Column_bucketId_fkey" FOREIGN KEY ("bucketId") REFERENCES "Bucket" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Column" ("bucketId", "id", "name") SELECT "bucketId", "id", "name" FROM "Column";
DROP TABLE "Column";
ALTER TABLE "new_Column" RENAME TO "Column";
CREATE TABLE "new_Session" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Session" ("id", "userId") SELECT "id", "userId" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
CREATE UNIQUE INDEX "Session_userId_key" ON "Session"("userId");
CREATE TABLE "new_Thought" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "text" TEXT NOT NULL,
    "columnId" TEXT NOT NULL,
    CONSTRAINT "Thought_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "Column" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Thought" ("columnId", "id", "text") SELECT "columnId", "id", "text" FROM "Thought";
DROP TABLE "Thought";
ALTER TABLE "new_Thought" RENAME TO "Thought";
CREATE TABLE "new_Bucket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    CONSTRAINT "Bucket_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Bucket" ("id", "name", "ownerId") SELECT "id", "name", "ownerId" FROM "Bucket";
DROP TABLE "Bucket";
ALTER TABLE "new_Bucket" RENAME TO "Bucket";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
