import { rateLimit } from "express-rate-limit";

const resend_otp = rateLimit({
  windowMs: 12 * 60 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: true,
});
