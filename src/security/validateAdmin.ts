import { Roles } from "./authentication";
import { validateRole } from "./validateRole";

export const validateAdmin = () => validateRole({ role: Roles.ADMIN });
