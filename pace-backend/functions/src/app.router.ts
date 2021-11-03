import { Router } from "express";
import { projectsRouter } from "./domains/projects/project.routes";
import { userRouter } from "./domains/users/users.router";

const router = Router();

router.use("/users", userRouter);
router.use("/projects", projectsRouter);

export default router;
