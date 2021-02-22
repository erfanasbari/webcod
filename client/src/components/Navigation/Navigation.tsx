import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./Navigation.scss";

export default function Navigation() {
	return (
		<>
			<section className="navigation">
				<h2>Webcod</h2>
				<nav>
					<span className="menu-title">Server</span>
					<ul>
						<li>
							<NavLink to="/" exact>
								Home
							</NavLink>
						</li>
					</ul>
				</nav>
				<div className="credit">
					<span>
						Created with ❤ by{" "}
						<a target="_blank" href="https://github.com/EInterStellar">
							InterStellar
						</a>
					</span>
				</div>
			</section>
		</>
	);
}
