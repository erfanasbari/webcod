import { users, servers } from "@prisma/client";

declare global {
	namespace Express {
		interface User extends users {}
		interface Request {
			server: servers;
		}
	}
}
