import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "../../store/user";
import { createSnackbar } from "../../store/ui";
import authApi from "../../api/auth";
import "./Navigation.scss";

export default function Navigation() {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);

	const logoutHandler = async (e: React.SyntheticEvent) => {
		await authApi.logOut().then((result) => {
			dispatch(logOut());
			dispatch(createSnackbar({ severity: "info", title: "Info", message: "Successfully Logged Out Of Account." }));
		});
		e.preventDefault();
	};

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

					<span className="menu-title">Account</span>
					<ul>
						{user.logged ? (
							<>
								<li>
									<Link to="" onClick={logoutHandler}>
										logout
									</Link>
								</li>
							</>
						) : (
							<>
								<li>
									<NavLink to="/login" exact>
										login
									</NavLink>
								</li>
								<li>
									<NavLink to="/register" exact>
										register
									</NavLink>
								</li>
							</>
						)}
					</ul>
				</nav>
				<div className="credit">
					<span>
						Created with ❤ by{" "}
						<a target="_blank" rel="noreferrer" href="https://github.com/EInterStellar">
							InterStellar
						</a>
					</span>
				</div>
			</section>
		</>
	);
}
