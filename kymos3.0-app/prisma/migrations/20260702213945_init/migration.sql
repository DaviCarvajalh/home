-- CreateTable
CREATE TABLE "sec_role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sec_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sec_user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "created_by" TEXT,
    "updated_by" TEXT,

    CONSTRAINT "sec_user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sec_role_name_key" ON "sec_role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "sec_user_email_key" ON "sec_user"("email");

-- CreateIndex
CREATE INDEX "idx_sec_user_email" ON "sec_user"("email");

-- CreateIndex
CREATE INDEX "idx_sec_user_role_id" ON "sec_user"("role_id");

-- AddForeignKey
ALTER TABLE "sec_user" ADD CONSTRAINT "sec_user_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "sec_role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
