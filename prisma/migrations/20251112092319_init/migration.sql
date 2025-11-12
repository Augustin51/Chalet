-- CreateTable
CREATE TABLE "Content" (
    "id" SERIAL NOT NULL,
    "page" TEXT NOT NULL,
    "component" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);
