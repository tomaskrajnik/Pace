import { Router } from "express";
import { invitationsRouter } from "./domains/invitations/invitations.router";
import { projectsRouter } from "./domains/projects/projects.routes";
import { userRouter } from "./domains/users/users.router";

const router = Router();

router.use("/users", userRouter);
router.use("/projects", projectsRouter);
router.use("/invitations", invitationsRouter);

export default router;
