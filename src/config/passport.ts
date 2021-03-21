import { PassportStatic } from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import prisma from "@db/client";

export default function configurePassport(passport: PassportStatic) {
	passport.use(
		new LocalStrategy(async (username, password, done) => {
			const user = await prisma.users.findUnique({ where: { username } });
			if (!user) return done(null, false, { message: "This username does not exist." });
			if (!bcrypt.compareSync(password, user.password))
				return done(null, false, { message: "Password was not correct." });
			return done(null, user);
		})
	);

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});

	passport.deserializeUser(async (id: number, done) => {
		const user = await prisma.users.findUnique({ where: { id } });
		if (user) done(null, user);
	});
}
