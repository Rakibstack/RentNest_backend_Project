import expess, {  Application, Request, Response } from "express";
import cors from "cors";
import cookiePerser from "cookie-parser";
import config from "./config";
import { notFoundRoute } from "./middleware/notFoundRoute";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { userRoutes } from "./module/user/user.route";
import { authRoutes } from "./module/auth/auth.route";
import { propertyRoutes } from "./module/properties/property.route";
import { categoryRoute } from "./module/category/category.route";
import { rentalRequestRoutes } from "./module/rentalRequest/rentalRequest.route";
import { paymentRoutes } from "./module/payment/payment.route";
import { paymentController } from "./module/payment/payment.controller";
import { reviewRoutes } from "./module/review/review.route";

const app: Application = expess();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.post(
  "/api/payments/confirm",
  expess.raw({ type: "application/json" }),
  paymentController.handleWebhook,
);

app.use(expess.json());
app.use(expess.urlencoded({ extended: true }));
app.use(cookiePerser());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});
app.use("/api/auth", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/landlord", propertyRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/categories", categoryRoute);
app.use("/api/rentals", rentalRequestRoutes);
app.use("/api/payments", paymentRoutes);
app.use('/api/reviews',reviewRoutes)

app.use(notFoundRoute);
app.use(globalErrorHandler);

export default app;
