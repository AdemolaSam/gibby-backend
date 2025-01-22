import { NextFunction, Request, Response, Router } from "express";
import { loginUser, logoutUser } from "../controllers/auth.controller";
import { authenticateJWT } from "../middlewares/jwt-verification";

const router = Router();

router.post("/login", loginUser);
router.post("/logout", authenticateJWT, logoutUser);

router.get(
  "/protected",
  authenticateJWT,
  (req: Request, res: Response, next: NextFunction): any => {
    return res.status(200).json({ message: "Welcome to the protected Route" });
  }
);

export default router;
