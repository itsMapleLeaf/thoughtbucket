-- RedefineIndex
DROP INDEX "Session_userId_unique";
CREATE UNIQUE INDEX "Session_userId_key" ON "Session"("userId");
