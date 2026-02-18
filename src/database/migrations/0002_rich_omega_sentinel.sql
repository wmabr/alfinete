CREATE TABLE "images" (
	"id" text PRIMARY KEY NOT NULL,
	"url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notices" ADD COLUMN "image_id" text;--> statement-breakpoint
ALTER TABLE "notices" ADD CONSTRAINT "notices_image_id_images_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."images"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notices" DROP COLUMN "image_url";