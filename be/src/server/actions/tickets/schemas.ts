import z from "zod";

const status = z.union([
  z.literal("idea"),
  z.literal("backlog"),
  z.literal("todo"),
  z.literal("inProgress"),
  z.literal("done"),
]);

export const createTicketSchema = z.object({
  title: z.string(),
  body: z.string().optional(),
  status: status.optional(),
});

export const moveTicketSchema = z.object({
  status,
});

export const ticketFilterSchema = z.object({
  status: status.optional(),
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
