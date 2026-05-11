import type { HydratedDocument } from "mongoose";

declare global {
  namespace Express {
    interface User {
      _id: string;
      name: string;
      email: string;
      role: "admin" | "editor" | "reviewer" | "viewer";
      status: "active" | "disabled";
    }

    interface Request {
      user?: HydratedDocument<User>;
    }
  }
}

export {};
