ALTER TABLE "account" ADD COLUMN "username" TEXT;

WITH cleaned AS (
  SELECT a."id",
         left(regexp_replace(translate(lower(u."name"), 'áàâãäåéèêëíìîïóòôõöúùûüçñý', 'aaaaaaeeeeiiiiooooouuuucny'), '[^a-z0-9]', '', 'g'), 20) AS base
  FROM "account" a
  JOIN "user" u ON u."id" = a."user_id"
),
candidates AS (
  SELECT "id",
         CASE WHEN base ~ '^[a-z][a-z0-9]{2,}$' THEN base ELSE left('user' || base, 20) END AS candidate
  FROM cleaned
),
numbered AS (
  SELECT "id", candidate, row_number() OVER (PARTITION BY candidate ORDER BY "id") AS position
  FROM candidates
)
UPDATE "account" a
SET "username" = CASE
  WHEN n.position = 1 AND n.candidate NOT IN ('editar', 'atributos', 'admin', 'suporte', 'scoutme', 'scoutmepro')
    THEN n.candidate
  ELSE n.candidate || '_' || a."id"
END
FROM numbered n
WHERE n."id" = a."id";

ALTER TABLE "account" ALTER COLUMN "username" SET NOT NULL;
CREATE UNIQUE INDEX "account_username_key" ON "account"("username");
ALTER TABLE "account" ADD CONSTRAINT "account_username_format_check" CHECK ("username" ~ '^[a-z][a-z0-9._]{2,29}$');

CREATE TABLE "follow" (
    "follower_id" INTEGER NOT NULL,
    "followed_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accepted_at" TIMESTAMP(3),

    CONSTRAINT "follow_pkey" PRIMARY KEY ("follower_id","followed_id")
);

CREATE INDEX "follow_followed_id_status_idx" ON "follow"("followed_id", "status");
CREATE INDEX "follow_follower_id_status_idx" ON "follow"("follower_id", "status");

ALTER TABLE "follow" ADD CONSTRAINT "follow_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "follow" ADD CONSTRAINT "follow_followed_id_fkey" FOREIGN KEY ("followed_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "follow" ADD CONSTRAINT "follow_not_self_check" CHECK ("follower_id" <> "followed_id");
ALTER TABLE "follow" ADD CONSTRAINT "follow_status_check" CHECK ("status" IN ('pending', 'accepted'));
