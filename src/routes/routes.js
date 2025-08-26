import authRouter from "./auth.js";
import userRouter from "./user.js";
import expenseRouter from "./expense-routes.js";
import categoryRouter from "./category-routes.js";
import monthlyBreakdownRouter from "./monthly-breakdown-routes.js";

const configureRoutes = (app) => {
  // Auth routes
  app.use("/api/auth", authRouter);
  
  // User routes
  app.use("/api/user", userRouter);
  
  // Expense routes
  app.use("/api/expenses", expenseRouter);
  
  // Category routes
  app.use("/api/categories", categoryRouter);
  
  // Monthly breakdown routes
  app.use("/api/monthly-breakdown", monthlyBreakdownRouter);
};

export default configureRoutes;