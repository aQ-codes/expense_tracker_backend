import authRouter from "./auth.js";
import expenseRouter from "./expense-routes.js";
import categoryRouter from "./category-routes.js";
import dashboardRouter from "./dashboard-routes.js";

const configureRoutes = (app) => {
  // Auth routes (some public, some protected)
  app.use("/api/auth", authRouter);
  
  // Protected routes - all require authentication
  app.use("/api/expenses", expenseRouter);
  app.use("/api/categories", categoryRouter);
  app.use("/api/dashboard", dashboardRouter);
};

export default configureRoutes;