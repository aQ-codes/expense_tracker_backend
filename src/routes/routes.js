import authRouter from "./auth.js";
import expenseRouter from "./expense-routes.js";
import categoryRouter from "./category-routes.js";

const configureRoutes = (app) => {
  // Auth routes
  app.use("/api/auth", authRouter);
  
  // Expense routes
  app.use("/api/expenses", expenseRouter);
  
  // Category routes
  app.use("/api/categories", categoryRouter);
};

export default configureRoutes;