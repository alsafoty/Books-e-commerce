-- DropForeignKey
ALTER TABLE "public"."CategoryImage" DROP CONSTRAINT "CategoryImage_categoryId_fkey";

-- AddForeignKey
ALTER TABLE "public"."CategoryImage" ADD CONSTRAINT "CategoryImage_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
