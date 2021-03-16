import Rcon from "rcon-srcds";

const serverRcon = {
	isRcon: async (
		appId: GameServer.appId,
		host: string,
		port: number,
		rconPassword: string,
		timeout: number = 3000
	) => {
		try {
			switch (appId) {
				case 7940: {
					// Call of Duty 4
					await new Rcon({ host, port, timeout: 100 }).authenticate(rconPassword);
					return true;
					break;
				}
			}
		} catch (error) {
			return false;
		}
	},
};

export default serverRcon;
