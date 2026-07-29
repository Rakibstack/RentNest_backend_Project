import z from "zod";
import { UserStatus } from "../../../generated/prisma/enums";

export const createUpdateUserStatusSchema = z.object({
  status: z.nativeEnum(UserStatus),
});

export type createUpdateUserStatusPayload = z.infer<
  typeof createUpdateUserStatusSchema
>;
