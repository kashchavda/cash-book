import path from "path";
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
import fundsRoutes from "./routes/funds.routes";
import billRoutes from "./routes/bill.routes";
import fundRoutes from "./routes/funds.routes";
import userRoutes from "./routes/user.routes";
import profileRoutes from "./routes/profile.routes";
import businessRoutes from "./routes/business.routes";
import attendanceRoutes from "./routes/attendance.routes";
import salaryRoutes from "./routes/salary.routes";
import permissionRoutes from "./routes/permission.routes";




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
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/funds", fundsRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/funds", fundRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/business", businessRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/salary", salaryRoutes);
app.use("/api/permissions", permissionRoutes);

export default app;
