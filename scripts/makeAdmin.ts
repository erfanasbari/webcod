import readline from "readline";
import prisma from "../src/prisma/client";

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

rl.question("Enter the username that you want to make admin: ", async (answer) => {
	const user = await prisma.users.findUnique({ where: { username: answer } });
	if (user) {
		if (user.role === 100) console.log(`${answer} is already an admin!`);
		else {
			await prisma.users.update({
				data: { role: 100 },
				where: { username: answer },
			});
			console.log(`Changed the role of ${answer} to 100.`);
		}
	} else console.log(`There is no user called ${answer}`);

	prisma.$disconnect();
	rl.close();
});
