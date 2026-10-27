CREATE TABLE "notification_template" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "link" TEXT,

    CONSTRAINT "notification_template_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "notification_template_title_key" ON "notification_template"("title");

INSERT INTO "notification_template" ("title", "type", "message", "link") VALUES
    ('request-follow', 'FOLLOW', 'pediu para seguir você.', '/configuracoes-e-privacidade/privacidade/pedidos'),
    ('followed-you-back', 'FOLLOW', 'começou a seguir você.', '/perfil/:username'),
    ('accepted-request-follow', 'FOLLOW', 'aceitou seu pedido para seguir.', '/perfil/:username');

CREATE TABLE "notification" (
    "id" SERIAL NOT NULL,
    "user_generator_notification" INTEGER NOT NULL,
    "user_receives_notification" INTEGER NOT NULL,
    "template_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read_at" TIMESTAMP(3),

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "notification_user_receives_notification_created_at_idx" ON "notification"("user_receives_notification", "created_at");

ALTER TABLE "notification" ADD CONSTRAINT "notification_user_generator_notification_fkey" FOREIGN KEY ("user_generator_notification") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "notification" ADD CONSTRAINT "notification_user_receives_notification_fkey" FOREIGN KEY ("user_receives_notification") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "notification" ADD CONSTRAINT "notification_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "notification_template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "notification" ADD CONSTRAINT "notification_not_self_check" CHECK ("user_generator_notification" <> "user_receives_notification");
