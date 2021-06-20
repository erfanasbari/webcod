const fs = require("fs");
const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");
const path = require("path");

const checkEnvResult = (configOutput) => {
	const expandOutput = dotenvExpand(configOutput);
	if (expandOutput.error) throw expandOutput.error;
};

const readEnvFileAndOverwrite = (path) => {
	const envConfig = dotenv.parse(fs.readFileSync(path));
	for (const k in envConfig) {
		process.env[k] = envConfig[k];
	}
};

checkEnvResult(dotenv.config({ path: path.resolve(__dirname, "../../.env") }));

switch (process.env.NODE_ENV) {
	case "development": {
		readEnvFileAndOverwrite(path.resolve(__dirname, "../../.env.development"));
		break;
	}
}

checkEnvResult(dotenv.config({ path: path.resolve(__dirname, "../prisma/prisma.env") }));
