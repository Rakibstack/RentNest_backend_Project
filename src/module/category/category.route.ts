import { Router } from "express";
import { categoryController } from "./category.controller";

const route = Router()


route.get('/',categoryController.getAllCategory)


export const categoryRoute = route
