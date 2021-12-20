/*
  Warnings:

  - You are about to drop the column `phrase` on the `PhraseToFilterOut` table. All the data in the column will be lost.
  - Added the required column `content` to the `PhraseToFilterOut` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PhraseToFilterOut" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_PhraseToFilterOut" ("createdAt", "id") SELECT "createdAt", "id" FROM "PhraseToFilterOut";
DROP TABLE "PhraseToFilterOut";
ALTER TABLE "new_PhraseToFilterOut" RENAME TO "PhraseToFilterOut";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
