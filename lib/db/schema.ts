import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  jsonb,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: varchar('role', { length: 20 }).notNull().default('member'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const teams = pgTable('teams', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  stripeCustomerId: text('stripe_customer_id').unique(),
  stripeSubscriptionId: text('stripe_subscription_id').unique(),
  stripeProductId: text('stripe_product_id'),
  planName: varchar('plan_name', { length: 50 }),
  subscriptionStatus: varchar('subscription_status', { length: 20 }),
});

export const teamMembers = pgTable('team_members', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id),
  role: varchar('role', { length: 50 }).notNull(),
  joinedAt: timestamp('joined_at').notNull().defaultNow(),
});

export const activityLogs = pgTable('activity_logs', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id),
  userId: integer('user_id').references(() => users.id),
  action: text('action').notNull(),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  ipAddress: varchar('ip_address', { length: 45 }),
});

export const invitations = pgTable('invitations', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id),
  email: varchar('email', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull(),
  invitedBy: integer('invited_by')
    .notNull()
    .references(() => users.id),
  invitedAt: timestamp('invited_at').notNull().defaultNow(),
  status: varchar('status', { length: 20 }).notNull().default('pending'),
});

export const launchFrameProjects = pgTable('launch_frame_projects', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id')
    .notNull()
    .references(() => teams.id),
  createdBy: integer('created_by').references(() => users.id),
  name: varchar('name', { length: 120 }).notNull(),
  slug: varchar('slug', { length: 160 }).notNull(),
  sourceUrl: text('source_url'),
  defaultLocale: varchar('default_locale', { length: 12 }).notNull().default('en'),
  brandKit: jsonb('brand_kit')
    .$type<{
      logoUrl?: string | null;
      primaryColor: string;
      accentColor: string;
      font: string;
    }>()
    .notNull(),
  settings: jsonb('settings')
    .$type<{
      selectedPackGroup?: string;
      selectedPack?: string;
      selectedTemplate?: string;
      frame?: Record<string, unknown>;
      crop?: Record<string, unknown>;
      layers?: Record<string, unknown>;
      textStyle?: Record<string, unknown>;
      backgroundStyle?: Record<string, unknown>;
    }>()
    .notNull()
    .default({}),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const launchFrameCaptures = pgTable('launch_frame_captures', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id')
    .notNull()
    .references(() => launchFrameProjects.id),
  sceneId: varchar('scene_id', { length: 80 }).notNull(),
  name: varchar('name', { length: 120 }).notNull(),
  sourceType: varchar('source_type', { length: 20 }).notNull(),
  sourceUrl: text('source_url'),
  device: varchar('device', { length: 20 }).notNull(),
  viewport: jsonb('viewport')
    .$type<{
      width: number;
      height: number;
      deviceScaleFactor?: number;
    }>()
    .notNull(),
  imageUrl: text('image_url'),
  metadata: jsonb('metadata').$type<Record<string, unknown>>().notNull().default({}),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const launchFrameAssets = pgTable('launch_frame_assets', {
  id: serial('id').primaryKey(),
  projectId: integer('project_id')
    .notNull()
    .references(() => launchFrameProjects.id),
  captureId: integer('capture_id').references(() => launchFrameCaptures.id),
  sceneId: varchar('scene_id', { length: 80 }).notNull(),
  platform: varchar('platform', { length: 40 }).notNull(),
  templateId: varchar('template_id', { length: 40 }).notNull(),
  width: integer('width').notNull(),
  height: integer('height').notNull(),
  format: varchar('format', { length: 12 }).notNull(),
  title: text('title'),
  subtitle: text('subtitle'),
  outputUrl: text('output_url'),
  fileName: text('file_name').notNull(),
  metadata: jsonb('metadata').$type<Record<string, unknown>>().notNull().default({}),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const teamsRelations = relations(teams, ({ many }) => ({
  teamMembers: many(teamMembers),
  activityLogs: many(activityLogs),
  invitations: many(invitations),
  launchFrameProjects: many(launchFrameProjects),
}));

export const usersRelations = relations(users, ({ many }) => ({
  teamMembers: many(teamMembers),
  invitationsSent: many(invitations),
  launchFrameProjects: many(launchFrameProjects),
}));

export const invitationsRelations = relations(invitations, ({ one }) => ({
  team: one(teams, {
    fields: [invitations.teamId],
    references: [teams.id],
  }),
  invitedBy: one(users, {
    fields: [invitations.invitedBy],
    references: [users.id],
  }),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  team: one(teams, {
    fields: [activityLogs.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
}));

export const launchFrameProjectsRelations = relations(
  launchFrameProjects,
  ({ one, many }) => ({
    team: one(teams, {
      fields: [launchFrameProjects.teamId],
      references: [teams.id],
    }),
    creator: one(users, {
      fields: [launchFrameProjects.createdBy],
      references: [users.id],
    }),
    captures: many(launchFrameCaptures),
    assets: many(launchFrameAssets),
  })
);

export const launchFrameCapturesRelations = relations(
  launchFrameCaptures,
  ({ one, many }) => ({
    project: one(launchFrameProjects, {
      fields: [launchFrameCaptures.projectId],
      references: [launchFrameProjects.id],
    }),
    assets: many(launchFrameAssets),
  })
);

export const launchFrameAssetsRelations = relations(launchFrameAssets, ({ one }) => ({
  project: one(launchFrameProjects, {
    fields: [launchFrameAssets.projectId],
    references: [launchFrameProjects.id],
  }),
  capture: one(launchFrameCaptures, {
    fields: [launchFrameAssets.captureId],
    references: [launchFrameCaptures.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;
export type TeamMember = typeof teamMembers.$inferSelect;
export type NewTeamMember = typeof teamMembers.$inferInsert;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;
export type Invitation = typeof invitations.$inferSelect;
export type NewInvitation = typeof invitations.$inferInsert;
export type LaunchFrameProject = typeof launchFrameProjects.$inferSelect;
export type NewLaunchFrameProject = typeof launchFrameProjects.$inferInsert;
export type LaunchFrameCapture = typeof launchFrameCaptures.$inferSelect;
export type NewLaunchFrameCapture = typeof launchFrameCaptures.$inferInsert;
export type LaunchFrameAsset = typeof launchFrameAssets.$inferSelect;
export type NewLaunchFrameAsset = typeof launchFrameAssets.$inferInsert;
export type TeamDataWithMembers = Team & {
  teamMembers: (TeamMember & {
    user: Pick<User, 'id' | 'name' | 'email'>;
  })[];
};

export enum ActivityType {
  SIGN_UP = 'SIGN_UP',
  SIGN_IN = 'SIGN_IN',
  SIGN_OUT = 'SIGN_OUT',
  UPDATE_PASSWORD = 'UPDATE_PASSWORD',
  DELETE_ACCOUNT = 'DELETE_ACCOUNT',
  UPDATE_ACCOUNT = 'UPDATE_ACCOUNT',
  CREATE_TEAM = 'CREATE_TEAM',
  REMOVE_TEAM_MEMBER = 'REMOVE_TEAM_MEMBER',
  INVITE_TEAM_MEMBER = 'INVITE_TEAM_MEMBER',
  ACCEPT_INVITATION = 'ACCEPT_INVITATION',
}
