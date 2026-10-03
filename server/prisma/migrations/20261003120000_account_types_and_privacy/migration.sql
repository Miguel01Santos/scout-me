-- Renomeia os valores dos tipos de conta (a coluna "type" continua a mesma)
UPDATE "account" SET "type" = 'player' WHERE "type" = 'person';
UPDATE "account" SET "type" = 'organization' WHERE "type" = 'federation';

-- AlterTable
ALTER TABLE "account" ADD COLUMN "is_private" BOOLEAN NOT NULL DEFAULT true;
