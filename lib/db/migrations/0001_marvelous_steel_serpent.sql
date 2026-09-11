CREATE TABLE "launch_frame_assets" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"capture_id" integer,
	"scene_id" varchar(80) NOT NULL,
	"platform" varchar(40) NOT NULL,
	"template_id" varchar(40) NOT NULL,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	"format" varchar(12) NOT NULL,
	"title" text,
	"subtitle" text,
	"output_url" text,
	"file_name" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "launch_frame_captures" (
	"id" serial PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"scene_id" varchar(80) NOT NULL,
	"name" varchar(120) NOT NULL,
	"source_type" varchar(20) NOT NULL,
	"source_url" text,
	"device" varchar(20) NOT NULL,
	"viewport" jsonb NOT NULL,
	"image_url" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "launch_frame_projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"team_id" integer NOT NULL,
	"created_by" integer,
	"name" varchar(120) NOT NULL,
	"slug" varchar(160) NOT NULL,
	"source_url" text,
	"default_locale" varchar(12) DEFAULT 'en' NOT NULL,
	"brand_kit" jsonb NOT NULL,
	"settings" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "launch_frame_assets" ADD CONSTRAINT "launch_frame_assets_project_id_launch_frame_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."launch_frame_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "launch_frame_assets" ADD CONSTRAINT "launch_frame_assets_capture_id_launch_frame_captures_id_fk" FOREIGN KEY ("capture_id") REFERENCES "public"."launch_frame_captures"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "launch_frame_captures" ADD CONSTRAINT "launch_frame_captures_project_id_launch_frame_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."launch_frame_projects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "launch_frame_projects" ADD CONSTRAINT "launch_frame_projects_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "launch_frame_projects" ADD CONSTRAINT "launch_frame_projects_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;