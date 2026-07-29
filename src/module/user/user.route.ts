import { Router } from "express";
import { userController } from "./user.controller";
import { authMiddleware } from "../../middleware/authMiddleware";

const route = Router()

route.post('/register',userController.createUser)
route.get('/me',authMiddleware(),userController.getMyProfile)
route.patch('/me',authMiddleware(),userController.manageUserProfile)



export const userRoutes = route;