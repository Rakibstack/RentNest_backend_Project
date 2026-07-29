import z from "zod";

export const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name Is Required")
    .max(50, "Name cannot exceed 50 characters"),

  email: z.email("Invalid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password cannot exceed 20 characters"),
  phone: z.string().optional(),
  profileImage: z.string().optional(),
  role: z.enum(["TENANT", "LANDLORD"]),
});

export const createUpdateProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name Is Required")
    .max(50, "Name cannot exceed 50 characters")
    .optional(),
  phone: z
    .string()
    .min(11, "Phone Number must be at least 11 characters")
    .optional(),
  profileImage: z.string().min(5, "Image IS Requred").optional(),
});
export type createUpdateProfilePayload = z.infer<
  typeof createUpdateProfileSchema
>;

export type createUserPayload = z.infer<typeof createUserSchema>;
