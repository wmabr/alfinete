ALTER TABLE "notices" ALTER COLUMN "dismissible" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "notices" ALTER COLUMN "start_date" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "notices" ALTER COLUMN "end_date" SET DATA TYPE timestamp with time zone;