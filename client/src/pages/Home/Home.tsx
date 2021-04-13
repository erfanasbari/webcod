import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import generalConfig from "config/general";
import { getServers } from "store/servers";
import { PageTitle } from "components/StyledComponents/StyledComponents";

const Home = () => {
	const dispatch = useDispatch();
	const servers = useSelector((state) => state.servers);

	useEffect(() => {
		dispatch(getServers());
	}, []);

	return (
		<>
			<PageTitle>{generalConfig.app.name}'s Servers</PageTitle>
			<section className="server-list">
				<table>
					<thead>
						<tr>
							<th>server name</th>
							<th>players online</th>
							<th>current map</th>
							<th>join</th>
						</tr>
					</thead>
					<tbody>
						{servers.list.map((server) => (
							<tr className="server-item" key={server.info.slug}>
								<td className="server-name">
									<Link to={`/servers/${server.info.slug}`}>{server.info.name}</Link>
								</td>
								<td className="player-count">
									<span className="progress">
										<span
											className="graphical-value"
											style={{ width: `${(server.cache.online_players * 100) / server.cache.max_players}%` }}
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
						))}
					</tbody>
				</table>
			</section>
		</>
	);
};

export default Home;
