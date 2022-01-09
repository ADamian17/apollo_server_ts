-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_postedById_fkey";

-- AlterTable
ALTER TABLE "Link" ALTER COLUMN "postedById" DROP NOT NULL;

-- CreateTable
CREATE TABLE "_Votes" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Votes_AB_unique" ON "_Votes"("A", "B");

-- CreateIndex
CREATE INDEX "_Votes_B_index" ON "_Votes"("B");

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_postedById_fkey" FOREIGN KEY ("postedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Votes" ADD FOREIGN KEY ("A") REFERENCES "Link"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Votes" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
