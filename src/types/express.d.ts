import { AuthenticatedUser } from "@/entities/user/user.types";
import { Universe } from "@/entities/universe/universe.types";

declare global {
    namespace Express {
        interface Request {
            user?: AuthenticatedUser;
            universe?: Universe;
            requestId: string;
        }
    }
}