import { Router } from "express";
import { invitationsRouter } from "./api/invitations/invitations.router";
import { milestonesRouter } from "./api/milestones/milestones.router";
import { projectsRouter } from "./api/projects/projects.routes";
import { subtasksRouter } from "./api/subtasks/subtasks.router";
import { userRouter } from "./api/users/users.router";

const router = Router();

router.use("/users", userRouter);
router.use("/projects", projectsRouter);
router.use("/invitations", invitationsRouter);
router.use("/milestones", milestonesRouter);
router.use("/subtasks", subtasksRouter);

export default router;
