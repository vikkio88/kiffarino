import z from "zod";

export const createTicketSchema = z.object({
  title: z.string(),
});

export const ticketFilterSchema = z.object({
  status: z
    .union([
      z.literal("idea"),
      z.literal("backlog"),
      z.literal("todo"),
      z.literal("inProgress"),
      z.literal("done"),
    ])
    .optional(),
  priority: z.coerce.number().optional(),
});