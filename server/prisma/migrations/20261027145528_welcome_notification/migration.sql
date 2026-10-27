ALTER TABLE "notification" ALTER COLUMN "user_generator_notification" DROP NOT NULL;

INSERT INTO "notification_template" ("title", "type", "message", "link") VALUES
    ('welcome', 'SYSTEM', 'Descubra perfis de atletas, olheiros e times e explore o ambiente de scouting.', '/buscar');

INSERT INTO "notification" ("user_receives_notification", "template_id", "created_at")
SELECT "account"."id", "notification_template"."id", "account"."created_at"
FROM "account"
CROSS JOIN "notification_template"
WHERE "account"."type" IS NOT NULL
  AND "notification_template"."title" = 'welcome';
