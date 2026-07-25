import { z } from "zod";

export const createPropertySchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters")
    .max(2000, "Description cannot exceed 2000 characters"),

  location: z.string().trim().min(3, "Location is required").max(255),

  rent: z
    .number()
    .int("Rent must be an integer")
    .positive("Rent must be greater than 0"),

  bedRoom: z.number().int().min(0).optional(),

  bathRooms: z.number().int().min(0).optional(),

  image: z
    .array(z.string())
    .min(1, "At least one image is required")
    .max(10, "Maximum 10 images are allowed"),

  categoryId: z.string("Invalid category id"),
});

export const updatePropertySchema = createPropertySchema.partial();

export type updatePropertyPayload = z.infer<typeof updatePropertySchema>;

export type CreatePropertyPayload = z.infer<typeof createPropertySchema>;
