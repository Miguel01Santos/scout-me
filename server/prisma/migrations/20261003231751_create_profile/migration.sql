-- CreateTable
CREATE TABLE "profile" (
    "account_id" INTEGER NOT NULL,
    "display_name" TEXT,
    "bio" TEXT,
    "avatar_color" TEXT,

    CONSTRAINT "profile_pkey" PRIMARY KEY ("account_id")
);

-- AddForeignKey
ALTER TABLE "profile" ADD CONSTRAINT "profile_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
