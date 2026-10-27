CREATE TABLE "club_member" (
    "club_id" INTEGER NOT NULL,
    "member_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "joined_at" TIMESTAMP(3),

    CONSTRAINT "club_member_pkey" PRIMARY KEY ("club_id","member_id")
);

CREATE INDEX "club_member_member_id_status_idx" ON "club_member"("member_id", "status");

ALTER TABLE "club_member" ADD CONSTRAINT "club_member_club_id_fkey" FOREIGN KEY ("club_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "club_member" ADD CONSTRAINT "club_member_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "club_member" ADD CONSTRAINT "club_member_status_check" CHECK ("status" IN ('invited', 'active'));

ALTER TABLE "club_member" ADD CONSTRAINT "club_member_not_self_check" CHECK ("club_id" <> "member_id");

INSERT INTO "notification_template" ("title", "type", "message", "link") VALUES
    ('club-invite', 'CLUB', 'convidou você para o clube.', '/atividades/clube'),
    ('club-invite-accepted', 'CLUB', 'entrou para o seu clube.', '/perfil/:username');
