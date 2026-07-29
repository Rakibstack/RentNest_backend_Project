import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { authMiddleware } from "../../middleware/authMiddleware";
import { reviewController } from "./review.controller";

const route = Router();

route.post("/", authMiddleware(Role.TENANT), reviewController.createReview);

export const reviewRoutes = route;
