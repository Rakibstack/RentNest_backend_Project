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
route.patch(
  "/properties/:id",
  authMiddleware(Role.LANDLORD),
  propertyController.updateproperty,
);
route.delete(
  "/properties/:id",
  authMiddleware(Role.LANDLORD),
  propertyController.deleteProperty,
);

export const propertyRoutes = route;
