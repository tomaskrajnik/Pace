import { body } from "express-validator";

export const enum ValidationRouteTypes {
  Signup = "signup",
  Signin = "signin",
  Registered = "registered",
  UpdateUserInfo = "updateUser",
  RequestPasswordReset = "requestPasswordReset",
  CreateProject = "createProject",
  UpdateProject = "updateProject",
  InviteUser = "inviteUser",
}

export const validateRequest = (route: ValidationRouteTypes) => {
  switch (route) {
    case ValidationRouteTypes.Signup: {
      return [
        body("email").isEmail(),
        body("name").isLength({ min: 2, max: 25 }).withMessage("Name must be between 2 and 25 characters"),
        body("uid").not().isEmpty().withMessage("Uid cannot be empty"),
        body("phoneNumber", "phoneNumber does not exists").optional().isString(),
        body("companyName", "companyName does not exists").optional().isString(),
        body("jobTitle", "jobTitle does not exists").optional().isString(),
        body("photoUrl", "photoUrl does not exists").optional().isString(),
      ];
    }
    case ValidationRouteTypes.Signin: {
      return [
        body("email").isEmail().normalizeEmail(),
        body("password").not().isEmpty().withMessage("Password cannot be empty"),
      ];
    }
    case ValidationRouteTypes.Registered: {
      return body("email").isEmail();
    }
    case ValidationRouteTypes.RequestPasswordReset: {
      return body("email").isEmail();
    }
    case ValidationRouteTypes.UpdateUserInfo: {
      return [
        body("name", "name does not exists").optional().isString(),
        body("email", "email does not exists").optional().isString(),
        body("phoneNumber", "phoneNumber does not exists").optional().isString(),
        body("companyName", "companyName does not exists").optional().isString(),
        body("jobTitle", "jobTitle does not exists").optional().isString(),
        body("emailVerified", "emailVerified does not exists").optional().isBoolean(),
        body("photoUrl", "photoUrl does not exists").optional().isString(),
      ];
    }
    case ValidationRouteTypes.CreateProject: {
      return [
        body("name").isLength({ min: 2, max: 25 }).withMessage("Project name must be between 2 and 25 characters"),
      ];
    }
    case ValidationRouteTypes.UpdateProject: {
      return [
        body("name", "name does not exists").optional().isString(),
        body("photoUrl", "photoUrl does not exists").optional().isString(),
        body("projectName", "projectName does not exists").optional().isString(),
        body("invitedBy", "invitedBy does not exists").optional().isString(),
      ];
    }
    case ValidationRouteTypes.InviteUser: {
      return [body("email").isEmail(), body("role").isIn(["owner", "editor", "viewer"]).isString()];
    }
  }
};
