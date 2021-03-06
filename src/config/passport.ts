import { PassportStatic } from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import sequelize from "../database/sequelize";

export default function configurePassport(passport: PassportStatic) {
	passport.use(
		new LocalStrategy(async (username, password, done) => {
			const user = await sequelize.models.user.findOne({ where: { username } });
			if (!user) return done(null, false, { message: "no user found" });
			if (!bcrypt.compareSync(password, user.get("password") as string)) return done(null, false, { message: "incorrect password" });
			return done(null, user);
		})
	);

	passport.serializeUser((user: any, done) => {
		done(null, user.get("id"));
	});

	passport.deserializeUser(async (id: number, done) => {
		const user = await sequelize.models.user.findOne({ where: { id } });
		if (user) done(null, user);
	});
}
