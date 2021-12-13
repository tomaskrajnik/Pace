import { Router } from "express";
import { invitationsRouter } from "./domains/invitations/invitations.router";
import { milestonesRouter } from "./domains/milestones/milestones.router";
import { projectsRouter } from "./domains/projects/projects.routes";
import { subtasksRouter } from "./domains/subtasks/subtasks.router";
import { userRouter } from "./domains/users/users.router";

const router = Router();

router.use("/users", userRouter);
router.use("/projects", projectsRouter);
router.use("/invitations", invitationsRouter);
router.use("/milestones", milestonesRouter);
router.use("/subtasks", subtasksRouter);

export default router;
