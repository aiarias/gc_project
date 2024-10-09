import { DAYS_OF_WEEK_IN_ORDER } from "@/data/constants";
import { relations } from "drizzle-orm";
import { integer, pgTable, text, boolean, uuid, timestamp, index, pgEnum } from "drizzle-orm/pg-core";

const createdAt = timestamp("createAt").notNull().defaultNow();
const updateAt =  timestamp("updateAt").notNull().defaultNow().$onUpdate(() => new Date());


// this schema is to save the user of the clerk for the event
export const EventTable = pgTable("events", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description"),
    durationInMinutes: integer("durationInMinutes").notNull(),
    clerkUserId: text("clerkUserId").notNull(),
    isActive: boolean("isActive").notNull().default(true),
    createdAt,
    updateAt,
}, table => ({
    clerkUserIdIndez: index("clerkUserIdIndex").on(table.clerkUserId)
})
)

// this schema is to save the schedule of a clerk
export const ScheduleTable = pgTable("schedules", {
    id: uuid("id").primaryKey().defaultRandom(),
    timezone: text("timezone").notNull(), //the format is for explame 7:00 AM or 7:00 PM
    clerkUserId: text("clerkUserId").notNull().unique(),
    createdAt,
    updateAt,
})

export const scheduleRelations = relations(ScheduleTable, ({ many }) => ({
    availabilities: many(ScheduleAvailabilityTable)
}))

export const scheduleDayOfWeekEnum = pgEnum("day", DAYS_OF_WEEK_IN_ORDER)

// this schema is to save the availability of a schedule
export const ScheduleAvailabilityTable = pgTable("scheduleAvailabilities", {
    id: uuid("id").primaryKey().defaultRandom(),
    scheduleId: uuid("scheduleId").notNull().references(() => ScheduleTable.id, { onDelete: "cascade"}), //eso hace que si se borra un schedule se borren todos los scheduleAvailabilities
    startTime: text("endTime").notNull(), //the format is for explame 7:00 AM or 7:00 PM
    endTime: text("endTime").notNull(), //the format is for explame 7:00 AM or 7:00 PM
    dayOfWeek: scheduleDayOfWeekEnum("dayOfWeek").notNull(),
},
table => ({
    scheduleIdIndex: index("scheduleIdIndex").on(table.scheduleId),
})
)

export const ScheduleAvailabilityRelations = relations(ScheduleAvailabilityTable, ({ one }) => ({
    schedule: one(ScheduleTable, {
        fields: [ScheduleAvailabilityTable.scheduleId],
        references: [ScheduleTable.id]
    })
}))