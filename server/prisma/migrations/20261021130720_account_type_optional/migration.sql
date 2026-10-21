-- O tipo passa a ser escolhido depois do cadastro; vazio significa que ainda não foi escolhido.
-- AlterTable
ALTER TABLE "account" ALTER COLUMN "type" DROP NOT NULL;
