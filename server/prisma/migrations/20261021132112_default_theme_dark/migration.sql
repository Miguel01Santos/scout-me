-- Contas novas começam no tema escuro, igual às telas de login e cadastro.
-- As contas que já existem mantêm o tema que têm hoje.
-- AlterTable
ALTER TABLE "configuration" ALTER COLUMN "theme" SET DEFAULT 'dark';
