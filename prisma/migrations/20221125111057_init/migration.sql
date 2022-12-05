-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(30) NOT NULL,
    "last_name" VARCHAR(30),
    "email" VARCHAR(100) NOT NULL,
    "username" VARCHAR NOT NULL,
    "mobile_no" VARCHAR(15),
    "created_at" TIMESTAMP NOT NULL,
    "updated_at" TIMESTAMP NOT NULL,
    "deleted_at" TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");
