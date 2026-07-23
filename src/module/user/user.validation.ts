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
    phone:z.string().optional(),
     profileImage: z
    .string()
    .optional(),
    role:z.enum(["TENANT", "LANDLORD"]),
});
