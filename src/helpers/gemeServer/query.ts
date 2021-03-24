import sourceQuery from "source-server-query";
import config from "@config/configuration";
import prisma from "@db/client";
import { Prisma, servers } from ".prisma/client";

const serverQuery = {
	isOnline: async (appId: string, host: string, port: number, timeout: number = 3000) => {
		try {
			switch (appId) {
				case config.appIds.CoD4x: {
					const info = await sourceQuery.info(host, port, timeout);
					if (info.appid !== 7940) return false;
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
	updateServerCache: async (server: servers) => {
		try {
			switch (server.appId) {
				case config.appIds.CoD4x: {
					let info, players;
					try {
						info = await sourceQuery.info(server.ip, server.port, 3000);
						if (info.appid !== 7940) break;
						players = await sourceQuery.players(server.ip, server.port, 3000);
					} catch {
						break;
					}
					return await prisma.server_cache.update({
						data: {
							name: info.name as string,
							map: info.map as string,
							max_players: info.maxplayers as number,
							online_players: info.playersnum as number,
							players_info: JSON.stringify(players),
							is_online: true,
							last_update: Math.floor(Date.now() / 1000),
						},
						where: { server_id: server.id },
					});
				}
			}

			return await prisma.server_cache.update({
				data: { is_online: false, last_update: Math.floor(Date.now() / 1000) },
				where: { server_id: server.id },
			});
		} catch (error) {
			throw error;
		}
	},
};

export default serverQuery;
