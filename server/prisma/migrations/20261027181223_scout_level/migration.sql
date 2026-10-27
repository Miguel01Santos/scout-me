UPDATE "account" AS "scout"
SET "rating_score" = LEAST(10, 1 + FLOOR("given"."total" / 5))
FROM (
    SELECT "rater_id", COUNT(*) AS "total"
    FROM "rating"
    WHERE "is_private" = true OR "status" = 'published'
    GROUP BY "rater_id"
) AS "given"
WHERE "scout"."id" = "given"."rater_id"
  AND "scout"."type" = 'scout';
