import sourceQuery from "source-server-query";

const serverQuery = {
	isOnline: async (appId: GameServer.appId, host: string, port: number, timeout: number = 3000) => {
		try {
			switch (appId) {
				case 7940: {
					// Call of Duty 4
					const info = await sourceQuery.info(host, port, timeout);
					if (info?.appid !== 7940) return false;
					return true;
					break;
				}
			}
		} catch {
			return false;
		}
	},
};

export default serverQuery;
