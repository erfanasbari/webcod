import sourceQuery from "source-server-query";
import config from "../../config/configuration";

const serverQuery = {
	isOnline: async (appId: string, host: string, port: number, timeout: number = 3000) => {
		try {
			switch (appId) {
				case config.appIds.CoD4x: {
					const info = await sourceQuery.info(host, port, timeout);
					if (info?.appid !== 7940) return false;
					return true;
					break;
				}
				default: {
					return false;
				}
			}
		} catch {
			return false;
		}
	},
};

export default serverQuery;
