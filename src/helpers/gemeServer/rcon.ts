import Rcon from "rcon-srcds";
import config from "../../config/configuration";

const serverRcon = {
	isRcon: async (appId: string, host: string, port: number, rconPassword: string, timeout: number = 3000) => {
		return await new Promise(async (resolve, reject) => {
			setTimeout(() => {
				resolve(false);
			}, timeout);
			try {
				switch (appId) {
					case config.appIds.CoD4x: {
						await new Rcon({ host, port, timeout: 100 }).authenticate(rconPassword);
						resolve(true);
						break;
					}
					default: {
						resolve(false);
					}
				}
			} catch (error) {
				resolve(false);
			}
		});
	},
};

export default serverRcon;
