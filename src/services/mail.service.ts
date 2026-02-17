import nodemailer from "nodemailer";

export const sendEmailOTP = async (email: string, otp: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS  
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Cash Book OTP Verification",
      text: `Your OTP is: ${otp}. It will expire in 1 minute.`
    };

    await transporter.sendMail(mailOptions);

    console.log("OTP email sent successfully");
  } catch (error) {
    console.log("Email sending error:", error);
    throw error;
  }
};
