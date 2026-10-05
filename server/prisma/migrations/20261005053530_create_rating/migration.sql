-- CreateTable
CREATE TABLE "rating" (
    "id" SERIAL NOT NULL,
    "rater_id" INTEGER NOT NULL,
    "rated_id" INTEGER NOT NULL,
    "stars" SMALLINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "rating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "rating_rated_id_idx" ON "rating"("rated_id");

-- CreateIndex
CREATE UNIQUE INDEX "rating_rater_id_rated_id_key" ON "rating"("rater_id", "rated_id");

-- AddForeignKey
ALTER TABLE "rating" ADD CONSTRAINT "rating_rater_id_fkey" FOREIGN KEY ("rater_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rating" ADD CONSTRAINT "rating_rated_id_fkey" FOREIGN KEY ("rated_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddCheckConstraints
ALTER TABLE "rating" ADD CONSTRAINT "rating_stars_range_check" CHECK ("stars" BETWEEN 1 AND 5);
ALTER TABLE "rating" ADD CONSTRAINT "rating_no_self_rating_check" CHECK ("rater_id" <> "rated_id");
