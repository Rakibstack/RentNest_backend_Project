
import { z } from "zod";

export const createRentalRequestSchema = z.object({
  propertyId: z.uuid("Invalid property id"),

  moveInDate: z.coerce.date(),

  message: z
    .string()
    .trim()
    .max(255, "Message cannot exceed 255 characters")
    .optional(),
});

export type CreateRentalRequestPayload =
  z.infer<typeof createRentalRequestSchema>;