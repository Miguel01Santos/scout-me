ALTER TABLE "rating"
ADD COLUMN "is_private" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "technique" SMALLINT,
ADD COLUMN "tactics" SMALLINT,
ADD COLUMN "physical" SMALLINT,
ADD COLUMN "creativity" SMALLINT,
ADD COLUMN "evolution" SMALLINT;

UPDATE "rating"
SET "technique" = "stars" * 2,
    "tactics" = "stars" * 2,
    "physical" = "stars" * 2,
    "creativity" = "stars" * 2,
    "evolution" = "stars" * 2;

ALTER TABLE "rating"
ALTER COLUMN "technique" SET NOT NULL,
ALTER COLUMN "tactics" SET NOT NULL,
ALTER COLUMN "physical" SET NOT NULL,
ALTER COLUMN "creativity" SET NOT NULL,
ALTER COLUMN "evolution" SET NOT NULL;

ALTER TABLE "rating" DROP CONSTRAINT "rating_stars_range_check";
ALTER TABLE "rating" DROP COLUMN "stars";

ALTER TABLE "rating" ADD CONSTRAINT "rating_criteria_range_check" CHECK (
    "technique" BETWEEN 1 AND 10
    AND "tactics" BETWEEN 1 AND 10
    AND "physical" BETWEEN 1 AND 10
    AND "creativity" BETWEEN 1 AND 10
    AND "evolution" BETWEEN 1 AND 10
);

DROP INDEX "rating_rater_id_rated_id_key";
CREATE UNIQUE INDEX "rating_rater_id_rated_id_is_private_key" ON "rating"("rater_id", "rated_id", "is_private");

ALTER TABLE "account" ADD COLUMN "rating_score" DOUBLE PRECISION NOT NULL DEFAULT 0;

UPDATE "account" SET "rating_score" = 1 WHERE "type" IN ('player', 'scout');

UPDATE "account" AS "rated"
SET "rating_score" = "scores"."score"
FROM (
    SELECT "rating"."rated_id",
           ROUND(
               SUM(("technique" + "tactics" + "physical" + "creativity" + "evolution") / 5.0 * "weights"."weight")
               / SUM("weights"."weight"),
               2
           ) AS "score"
    FROM "rating"
    JOIN "account" AS "rater" ON "rater"."id" = "rating"."rater_id"
    CROSS JOIN LATERAL (
        SELECT CASE "rater"."type"
            WHEN 'player' THEN 1
            WHEN 'scout' THEN 2
            WHEN 'organization' THEN 3
            ELSE 0
        END AS "weight"
    ) AS "weights"
    WHERE "rating"."is_private" = false
      AND "weights"."weight" > 0
    GROUP BY "rating"."rated_id"
) AS "scores"
WHERE "rated"."id" = "scores"."rated_id";

INSERT INTO "notification_template" ("title", "type", "message", "link") VALUES
    ('rated-you', 'RATING', 'avaliou você.', '/perfil'),
    ('rated-you-privately', 'RATING', 'enviou uma avaliação privada para você.', '/perfil'),
    ('request-rating', 'RATING', 'pediu uma avaliação.', '/perfil/:username'),
    ('request-private-rating', 'RATING', 'pediu uma avaliação privada.', '/perfil/:username');
