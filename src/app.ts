import express from "express";
import authRoutes from "./routes/auth.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import supervisorRoutes from "./routes/supervisor.routes";
import adminRoutes from "./routes/admin.routes";
import workerRoutes from "./routes/worker.routes";
import subadminRoutes from "./routes/subadmin.routes";
import vendorRoutes from "./routes/vendor.routes";
import transactionRoutes from "./routes/transaction.routes";
import locationRoutes from "./routes/location.routes";
import notificationRoutes from "./routes/notification.routes";
import invoiceRoutes from "./routes/invoice.routes"; 




const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/supervisors", supervisorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/subadmins", subadminRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/invoices", invoiceRoutes);


export default app;
