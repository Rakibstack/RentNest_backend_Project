import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware";
import { Role } from "../../../generated/prisma/enums";
import { adminController } from "./admin.controller";

const route = Router();

route.get("/users", authMiddleware(Role.ADMIN), adminController.getAllUser);
route.patch(
  "/users/:id",
  authMiddleware(Role.ADMIN),
  adminController.updateUserStatus,
);

export const adminRoutes = route;
