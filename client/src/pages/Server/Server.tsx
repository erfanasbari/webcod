import { useState, useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentServer, getCurrentServer } from "store/servers";
import moment from "moment";
import { PageTitle } from "components/StyledComponents/StyledComponents";

interface PlayerInfo {
	index: number;
	name: string;
	score: number;
	duration: number;
}

const Server = ({ match }: RouteComponentProps<{ serverSlug: string }>) => {
	const dispatch = useDispatch();
	const server = useSelector((state) => state.servers.currentServer);
	const [playersInfo, setPlayersInfo] = useState<PlayerInfo[] | null>(null);

	useEffect(() => {
		if (server === null || server.info.slug !== match.params.serverSlug) dispatch(setCurrentServer(null));
		dispatch(getCurrentServer(match.params.serverSlug));

		const intervalId = setInterval(() => {
			setPlayersInfo((oldPlayersInfo) => {
				if (!oldPlayersInfo) return null;
				return oldPlayersInfo.map((playerInfo) => {
					const newPlayerInfo = { ...playerInfo };
					newPlayerInfo.duration++;
					return newPlayerInfo;
				});
			});
		}, 1000);

		return () => {
			clearInterval(intervalId);
		};
	}, []);

	useEffect(() => {
		setPlayersInfo(server ? JSON.parse(server.cache.players_info) : null);
	}, [server]);

	return (
		<>
			{server && (
				<>
					<PageTitle>{server.info.name}</PageTitle>
					<section className="server-list">
						<table>
							<thead>
								<tr>
									<th>server ip:port</th>
									<th>players online</th>
									<th>current map</th>
									<th>join</th>
								</tr>
							</thead>
							<tbody>
								<tr className="server-item" key={server.info.slug}>
									<td className="server-name">{`${server.info.ip}:${server.info.port}`}</td>
									<td className="player-count">
										<span className="progress">
											<span
												className="graphical-value"
												style={{
													width: `${(server.cache.online_players * 100) / server.cache.max_players}%`,
												}}
											></span>
											<span className="value">
												{server.cache.online_players}/{server.cache.max_players}
											</span>
										</span>
									</td>
									<td>{server.cache.map}</td>
									<td className="join-server">
										<a href={`cod4://${server.info.ip}:${server.info.port}`}>Click To Join</a>
									</td>
								</tr>
							</tbody>
						</table>
					</section>

					<section className="server-list server-players">
						<table>
							<thead>
								<tr>
									<th className="name">player name</th>
									<th className="score">score</th>
									<th className="timeConected">time</th>
								</tr>
							</thead>
							<tbody>
								{playersInfo && playersInfo.length ? (
									playersInfo.map((playerInfo) => (
										<tr key={playerInfo.index}>
											<td className="name">{playerInfo.name}</td>
											<td className="score">{playerInfo.score}</td>
											<td className="timeConected">
												{moment
													.utc(playerInfo.duration * 1000)
													.format("HH:mm:ss")
													.replace("00:", "")}
											</td>
										</tr>
									))
								) : (
									<tr>
										<td>No Players Found</td>
									</tr>
								)}
							</tbody>
						</table>
					</section>
				</>
			)}
		</>
	);
};

export default Server;
