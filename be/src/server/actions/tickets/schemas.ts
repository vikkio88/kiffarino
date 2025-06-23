import z from "zod";

export const createTicketSchema = z.object({
  title: z.string(),
  body: z.string().optional(),
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
  title: z.coerce.string().optional(),
});

export const updateTicketSchema = z.object({
  title: z.string().optional(),
  body: z.string().optional(),
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
