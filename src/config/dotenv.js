const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

switch (process.env.NODE_ENV) {
	case "development":
		checkEnvResult(dotenv.config({ path: path.resolve(__dirname, "../../.env.development") }));
		break;

	case "production":
		checkEnvResult(dotenv.config({ path: path.resolve(__dirname, "../../.env.production") }));
		break;
}

function checkEnvResult(envResult) {
	if (envResult.error) throw envResult.error;
}
