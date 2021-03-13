import { users } from "@prisma/client";

declare global {
	namespace Express {
		interface User extends users {}
	}
}
