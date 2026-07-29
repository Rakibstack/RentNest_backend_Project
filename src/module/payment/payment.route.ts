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
route.get(
  "/",
  authMiddleware(Role.TENANT),
  paymentController.getUserPaymentHistory,
);
route.get(
  "/:id",
  authMiddleware(Role.TENANT),
  paymentController.getSinglePaymentHistory,
);


export const paymentRoutes = route;
