-- CreateTable
CREATE TABLE "player_attributes" (
    "account_id" INTEGER NOT NULL,
    "preferred_foot" TEXT,
    "position" TEXT,
    "category" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "player_attributes_pkey" PRIMARY KEY ("account_id")
);

-- AddForeignKey
ALTER TABLE "player_attributes" ADD CONSTRAINT "player_attributes_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- AddCheckConstraints: o banco só aceita os valores de src/player/constants.js
ALTER TABLE "player_attributes" ADD CONSTRAINT "player_attributes_preferred_foot_check" CHECK ("preferred_foot" IN ('right', 'left', 'both'));
ALTER TABLE "player_attributes" ADD CONSTRAINT "player_attributes_position_check" CHECK ("position" IN ('goalkeeper', 'center_back', 'left_back', 'right_back', 'defensive_midfielder', 'midfielder', 'right_midfielder', 'left_midfielder', 'winger', 'right_winger', 'left_winger', 'striker', 'second_striker'));
ALTER TABLE "player_attributes" ADD CONSTRAINT "player_attributes_category_check" CHECK ("category" IN ('u7', 'u9', 'u11', 'u13', 'u15', 'u17', 'u20', 'u23'));
