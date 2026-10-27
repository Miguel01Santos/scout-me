CREATE TABLE "rating_request" (
    "requester_id" INTEGER NOT NULL,
    "scout_id" INTEGER NOT NULL,
    "is_private" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rating_request_pkey" PRIMARY KEY ("requester_id","scout_id","is_private")
);

CREATE INDEX "rating_request_scout_id_idx" ON "rating_request"("scout_id");

ALTER TABLE "rating_request" ADD CONSTRAINT "rating_request_requester_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "rating_request" ADD CONSTRAINT "rating_request_scout_id_fkey" FOREIGN KEY ("scout_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "rating_request" ADD CONSTRAINT "rating_request_not_self_check" CHECK ("requester_id" <> "scout_id");
