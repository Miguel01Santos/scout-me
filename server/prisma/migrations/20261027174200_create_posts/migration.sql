CREATE TABLE "post" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "position" SMALLINT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "post_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "post_account_id_position_key" UNIQUE ("account_id", "position") DEFERRABLE INITIALLY IMMEDIATE,
    CONSTRAINT "post_position_check" CHECK ("position" BETWEEN 1 AND 5),
    CONSTRAINT "post_description_length_check" CHECK (char_length("description") <= 120)
);

CREATE TABLE "post_photo" (
    "id" SERIAL NOT NULL,
    "post_id" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "position" SMALLINT NOT NULL,

    CONSTRAINT "post_photo_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "post_photo_position_check" CHECK ("position" BETWEEN 1 AND 5)
);

CREATE UNIQUE INDEX "post_photo_post_id_position_key" ON "post_photo"("post_id", "position");

CREATE TABLE "post_mention" (
    "post_id" INTEGER NOT NULL,
    "account_id" INTEGER NOT NULL,

    CONSTRAINT "post_mention_pkey" PRIMARY KEY ("post_id","account_id")
);

CREATE INDEX "post_mention_account_id_idx" ON "post_mention"("account_id");

ALTER TABLE "post" ADD CONSTRAINT "post_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "post_photo" ADD CONSTRAINT "post_photo_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "post_mention" ADD CONSTRAINT "post_mention_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "post_mention" ADD CONSTRAINT "post_mention_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "notification_template" ("title", "type", "message", "link") VALUES
    ('mentioned-you', 'POST', 'mencionou você em um post.', '/perfil/:username');
