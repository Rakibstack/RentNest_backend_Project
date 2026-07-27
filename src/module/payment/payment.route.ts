import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware";
import { Role } from "../../../generated/prisma/enums";
import { paymentController } from "./payment.controller";

const route = Router();

route.post(
  "/create",
  authMiddleware(Role.TENANT),
  paymentController.createPaymentSession,
);

 export const paymentRoutes = route