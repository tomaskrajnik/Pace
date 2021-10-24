import { body } from "express-validator";

export const enum ValidationRouteTypes {
  Signup = "signup",
  Signin = "signin",
  Registered = "registered",
  UpdateUserInfo = "updateUser",
}

export const validateRequest = (route: ValidationRouteTypes) => {
  switch (route) {
    case ValidationRouteTypes.Signup: {
      return [
        body("email").isEmail().normalizeEmail(),
        body("name").isLength({ min: 2, max: 25 }).withMessage("Last name must be between 2 and 25 characters"),
        body("uid").not().isEmpty().withMessage("Uid cannot be empty"),
        body("phoneNumber", "phoneNumber does not exists").optional().isString(),
        body("companyName", "companyName does not exists").optional().isNumeric(),
        body("jobTitle", "jobTitle does not exists").optional().isNumeric(),
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
      return body("email").isEmail().normalizeEmail();
    }
    case ValidationRouteTypes.UpdateUserInfo: {
      return [
        body("name", "name does not exists").optional().isString(),
        body("email", "email does not exists").optional().isString(),
        body("phoneNumber", "phoneNumber does not exists").optional().isString(),
        body("companyName", "companyName does not exists").optional().isNumeric(),
        body("jobTitle", "jobTitle does not exists").optional().isNumeric(),
        body("emailVerified", "emailVerified does not exists").optional().isBoolean(),
        body("photoUrl", "photoUrl does not exists").optional().isString(),
      ];
    }
  }
};
