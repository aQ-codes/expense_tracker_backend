import authRouter from "./auth.js";
import userRouter from "./user.js";
import expenseRouter from "./expense-routes.js";
import categoryRouter from "./category-routes.js";
import monthlyBreakdownRouter from "./monthly-breakdown-routes.js";

const configureRoutes = (app) => {
  console.log('🔧 Configuring routes...');
  
  // Auth routes
  app.use("/api/auth", authRouter);
  console.log('✅ Auth routes configured at /api/auth');
  
  // User routes
  app.use("/api/user", userRouter);
  console.log('✅ User routes configured at /api/user');
  
  // Expense routes
  app.use("/api/expenses", expenseRouter);
  console.log('✅ Expense routes configured at /api/expenses');
  
  // Category routes
  app.use("/api/categories", categoryRouter);
  console.log('✅ Category routes configured at /api/categories');
  
  // Monthly breakdown routes
  app.use("/api/monthly-breakdown", monthlyBreakdownRouter);
  console.log('✅ Monthly breakdown routes configured at /api/monthly-breakdown');
  
  console.log('🎯 All routes configured successfully!');
};

export default configureRoutes;