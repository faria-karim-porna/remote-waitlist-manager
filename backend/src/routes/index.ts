import { Router } from "express";
import { checkInUser, deleteUser, getUser, joinUser } from "../controllers/usersController";

const router: Router = Router();

router.post("/api/join", joinUser);
router.post("/api/checkIn", checkInUser);
router.get("/api/user/:name", getUser);
router.delete("/api/deleteUser", deleteUser);

export default router;
