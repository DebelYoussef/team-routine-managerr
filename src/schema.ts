import { pgTable, serial, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";


// Define Society Table
export const society = pgTable("society", {
  id: serial("id").primaryKey(),
  societyName: varchar("societyName", { length: 255 }).notNull(),
});

// Define User Table
export const user = pgTable("user", {
  id: serial("id").primaryKey(),
  firstName: varchar("firstName", { length: 50 }).notNull(),
  lastName: varchar("lastName", { length: 50 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  societyId: integer("societyId")
    .notNull()
    .references(() => society.id),
  role: varchar("role", { length: 50 }),
});

// Define Routine Table
export const routine = pgTable("routine", {
  id: serial("id").primaryKey(),
  email:boolean("email").notNull(),
  frequency: varchar("frequency", { length: 50 }),
  routineName: varchar("routineName", { length: 255 }).notNull(),
  startTime: timestamp("startTime").notNull(),
  type: varchar("type", { length: 50 }),
  reminder: varchar("reminder", { length: 50 }),
  userId: integer("userId")
    .notNull()
    .references(()=>user.id),
  active: boolean("active").notNull(),
  privacy: varchar("privacy", { length: 50 }),
  description: varchar("description", { length: 255 }),
});

// Define Question Table

export const question = pgTable("question", {
  id: serial("id").primaryKey(),
  routineId: integer("routineId")
    .notNull()
    .references(() => routine.id),
  question: varchar("question", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }),
});
export const option = pgTable('option', {
    id: serial('id').primaryKey(),
    value: varchar("optionValue", { length: 255 }).notNull(),
    questionId: integer('questionId')
      .notNull()
      .references(() => question.id),
  });


// Define Membership Table
export const membership = pgTable("membership", {
  id: serial("id").primaryKey(),
  employeeId: integer("employeeId")
    .notNull()
    .references(()=>user.id),
  routineId: integer("routineId")
    .notNull()
    .references(()=>routine.id),
});

export const reminder = pgTable("reminders", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description:  varchar("description", { length: 455 }).notNull(),
  reminder_time: timestamp("reminder_time").notNull(),
});
export const peopleToRemind = pgTable("peopleToRemind", {
  id: serial("id").primaryKey(),
  employeeId: integer("employeeId")
    .notNull()
    .references(()=>user.id),
  reminderId: integer("reminderId")
    .notNull()
    .references(()=>reminder.id),
});

export const note = pgTable("note", {
  id: serial("id").primaryKey(),
  employeeId: integer("employeeId")
    .notNull()
    .references(()=>user.id),
    title: varchar("title", { length: 255 }).notNull(),
    text:  varchar("text", { length: 755 }).notNull(),
    tags:  varchar("tags", { length: 755 }),
   date: timestamp("date"),
    

});
export const notification = pgTable("notification", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description:  varchar("description", { length: 455 }).notNull(),
  employeeId: integer("employeeId")
  .notNull()
  .references(()=>user.id),
  link:  varchar("link", { length: 755 }),
  seen:boolean('seen'),
  
});
export const response = pgTable("response", {
  id: serial("id").primaryKey(),
  employeeId: integer("employeeId")
    .notNull()
    .references(()=>user.id),
    questionId: integer("questionId")
    .notNull()
    .references(()=>question.id),
    date: timestamp("date")
    .notNull(),
  routineId: integer("routineId")
    .notNull()
    .references(()=>routine.id),
    value: varchar("value", { length: 255 }).notNull(),
});