-- CreateTable
CREATE TABLE "_userCompanies" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_userCompanies_AB_unique" ON "_userCompanies"("A", "B");

-- CreateIndex
CREATE INDEX "_userCompanies_B_index" ON "_userCompanies"("B");

-- AddForeignKey
ALTER TABLE "_userCompanies" ADD CONSTRAINT "_userCompanies_A_fkey" FOREIGN KEY ("A") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_userCompanies" ADD CONSTRAINT "_userCompanies_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
