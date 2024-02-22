import { NextFunction, Request, Response } from "express";
import { ValidationChain, body, validationResult } from "express-validator";



export const validate = (validations: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        for (let validation of validations) {
            const result = await validation.run(req);
            if (!result.isEmpty()) {
                break;
            }
        }

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        return res.status(422).json({ errors: errors.array() })
    }
}

export const signInValidator = [
    // body("name").notEmpty().withMessage("Name is required field"),
    body("email").trim().isEmail().notEmpty().withMessage("Email is required field"),
    body("password").trim().isLength({ min: 6 }).withMessage("Password should contain atleast 6 characters"),
]
export const signUpValidator = [
    body("name").notEmpty().withMessage("Name is required field"),
    // body("email").trim().isEmail().notEmpty().withMessage("Email is required field"),
    // body("password").trim().isLength({ min: 6 }).withMessage("Password should contain atleast 6 characters"),
    ...signInValidator,
]
export const chatCompletionValidator = [
    body("message").notEmpty().withMessage("Message is required field"),
   
]