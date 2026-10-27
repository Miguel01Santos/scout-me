CREATE TABLE "recent_search" (
    "account_id" INTEGER NOT NULL,
    "searched_account_id" INTEGER NOT NULL,
    "searched_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recent_search_pkey" PRIMARY KEY ("account_id","searched_account_id")
);

CREATE INDEX "recent_search_account_id_searched_at_idx" ON "recent_search"("account_id", "searched_at");

ALTER TABLE "recent_search" ADD CONSTRAINT "recent_search_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "recent_search" ADD CONSTRAINT "recent_search_searched_account_id_fkey" FOREIGN KEY ("searched_account_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "recent_search" ADD CONSTRAINT "recent_search_not_self_check" CHECK ("account_id" <> "searched_account_id");
