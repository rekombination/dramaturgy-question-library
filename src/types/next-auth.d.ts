import { UserRole, TrustLevel } from "@prisma/client";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      trustLevel: TrustLevel;
    } & DefaultSession["user"];
  }
}
