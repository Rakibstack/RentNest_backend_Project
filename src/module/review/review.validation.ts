import z from "zod";

export const createReviewValidationSchema = z.object({
  rentalRequestId: z.uuid({
    error: "Invalid rental request ID.",
  }),

  rating: z
    .number({
      error: "Rating is required.",
    })
    .min(1, {
      error: "Rating must be at least 1.",
    })
    .max(5, {
      error: "Rating cannot exceed 5.",
    }),

  comment: z
    .string({
      error: "Comment is required.",
    })
    .trim()
    .min(5, {
      error: "Comment must be at least 5 characters long.",
    })
    .max(255, {
      error: "Comment cannot exceed 255 characters.",
    }),
});

export type createReviewValidationPayload = z.infer<
  typeof createReviewValidationSchema
>;
