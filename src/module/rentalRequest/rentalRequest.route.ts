import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware";
import { Role } from "../../../generated/prisma/enums";
import { rentalRequestController } from "./rentalRequest.controller";

const route = Router();

route.post(
  "/",
  authMiddleware(Role.TENANT,),
  rentalRequestController.createRentalRequest,
);


 export const rentalRequestRoutes = route
