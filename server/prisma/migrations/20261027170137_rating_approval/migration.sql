ALTER TABLE "account" ADD COLUMN "review_ratings" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "rating" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'published';

ALTER TABLE "rating" ADD CONSTRAINT "rating_status_check" CHECK ("status" IN ('pending', 'published', 'hidden'));

CREATE INDEX "rating_rated_id_status_idx" ON "rating"("rated_id", "status");

INSERT INTO "notification_template" ("title", "type", "message", "link") VALUES
    ('rated-you-pending', 'RATING', 'avaliou você. Revise para compartilhar no seu perfil.', '/configuracoes-e-privacidade/privacidade/avaliacoes');
