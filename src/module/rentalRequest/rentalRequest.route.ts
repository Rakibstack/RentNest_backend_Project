import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware";
import { Role } from "../../../generated/prisma/enums";
import { rentalRequestController } from "./rentalRequest.controller";

const route = Router();

route.post(
  "/",
  authMiddleware(Role.TENANT),
  rentalRequestController.createRentalRequest,
);
route.get(
  "/",
  authMiddleware(Role.TENANT),
  rentalRequestController.getUserRentalRequest,
);
route.get(
  "/:id",
  authMiddleware(Role.TENANT),
  rentalRequestController.getSingleRentalRequest,
);

export const rentalRequestRoutes = route;
