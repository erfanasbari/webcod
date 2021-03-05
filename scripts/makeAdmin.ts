import readline from "readline";
import sequelize from "../src/database/sequelize";

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

rl.question("Enter the username that you want to make admin: ", async (answer) => {
	const user = await sequelize.models.user.findOne({ attributes: ["role"], where: { username: answer } });
	if (user) {
		if (user.get("role") === 100) console.log(`${answer} is already an admin!`);
		else {
			await sequelize.models.user.update({ role: 100 }, { where: { username: answer } });
			console.log(`Changed the role of ${answer} to 100.`);
		}
	} else console.log(`There is no user called ${answer}!`);

	rl.close();
});
