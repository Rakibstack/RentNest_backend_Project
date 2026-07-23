import expess, { Application, Request, Response } from "express";
import cors from "cors";
import cookiePerser from "cookie-parser"
import config from "./config";
import { notFoundRoute } from "./middleware/notFoundRoute";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import { userRoutes } from "./module/user/user.route";

const app: Application = expess();

app.use(cors({
    origin: config.app_url,
    credentials: true,
}));

app.use(expess.json());
app.use(expess.urlencoded({extended: true}))
app.use(cookiePerser())

app.get('/',(req :Request,res:Response) => {
    res.send("Hello World")
})
app.use('/api/auth',userRoutes)


app.use(notFoundRoute) 
app.use(globalErrorHandler)


export default app;
