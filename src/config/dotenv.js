const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");
const path = require("path");

const checkEnvResult = (configOutput) => {
	const expandOutput = dotenvExpand(configOutput);
	if (expandOutput.error) throw expandOutput.error;
};

checkEnvResult(dotenv.config({ path: path.resolve(__dirname, "../../.env") }));

switch (process.env.NODE_ENV) {
	case "development": {
		checkEnvResult(dotenv.config({ path: path.resolve(__dirname, "../../.env.development") }));
		break;
	}
}

checkEnvResult(dotenv.config({ path: path.resolve(__dirname, "../prisma/prisma.env") }));
