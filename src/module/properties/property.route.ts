import { Router } from "express";
import { propertyController } from "./property.controller";
import { authMiddleware } from "../../middleware/authMiddleware";
import { Role } from "../../../generated/prisma/enums";

const route = Router();

route.post(
  "/properties",
  authMiddleware(Role.LANDLORD),
  propertyController.createProperty,
);

export const propertyRoutes = route
