import authRouter from "./auth.js";

const configureRoutes = (app) => {
  // Auth routes
  app.use("/api/auth", authRouter);
};

export default configureRoutes;