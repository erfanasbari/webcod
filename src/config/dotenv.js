const dotenv = require("dotenv");

dotenv.config({ path: "../../.env" });

switch (process.env.NODE_ENV) {
	case "development": {
		checkEnvResult(dotenv.config({ path: "../../.env.development" }));
	}
	case "production": {
		checkEnvResult(dotenv.config({ path: "../../.env.production" }));
	}
}

function checkEnvResult(envResult) {
	if (envResult.error) throw envResult.error;
}
