import z from "zod";

export const createPaymentValidationSchema = z.object({
  rentalRequestId: z.uuid(),
});
