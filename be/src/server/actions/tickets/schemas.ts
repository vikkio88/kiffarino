import {
  ticketStatuses,
  ticketTypes,
  type TicketStatus,
} from "@kiffarino/shared";
import z from "zod/v4";

const status = z.enum(ticketStatuses);
const type = z.enum(ticketTypes);

export const createTicketSchema = z.object({
  title: z.string(),
  body: z.string().optional(),
  status: status.optional(),
  type: type.optional(),
  tags: z.array(z.string().min(2)).optional(),
});

export const moveTicketSchema = z.object({
  status,
});

export const ticketFilterSchema = z.object({
  type: type.optional(),
  statuses: z
    .string()
    .optional()
    .transform((val) => val?.split(","))
    .refine(
      (arr): arr is TicketStatus[] | undefined =>
        !arr || arr.every((s) => ticketStatuses.includes(s as TicketStatus)),
      { message: "Invalid status value(s)" }
    ),
  priority: z.coerce.number().optional(),
  title: z.coerce.string().optional(),
});

export const updateTicketSchema = z.object({
  title: z.string().optional(),
  body: z.string().optional(),
  type: type.optional(),
  status: status.optional(),
  priority: z.coerce.number().optional(),
  tags: z.union([z.tuple([]), z.array(z.string().min(2))]).optional(),
});
