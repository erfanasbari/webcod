import react from "react";
import {} from "react-router-dom";
import generalConfig from "./../../config/general";
import { PageTitle } from "./../../components/StyledComponents/StyledComponents";
import "./Home.scss";

export default function Home() {
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
						<tr className="server-item">
							<td className="server-name">
								<a href="http://cod4.baxir.ir/?id=9">BaxIrani[SD]</a>
							</td>
							<td className="player-count">
								<span className="progress">
									<span className="graphical-value" style={{ width: "83.333333333333%" }}></span>
									<span className="value">20/24</span>
								</span>
							</td>
							<td>Crash_snow</td>
							<td className="join-server">
								<a href="cod4://5.63.14.14:28960">Click To Join</a>
							</td>
						</tr>
					</tbody>
				</table>
			</section>
		</>
	);
}
