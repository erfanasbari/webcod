import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "store/user";
import "./Navigation.scss";

const Navigation = () => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);

	const logoutHandler = async (e: React.SyntheticEvent) => {
		dispatch(logOut());
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

					{user.logged && user.role >= 80 && (
						<>
							<span className="menu-title">Admin</span>
							<ul>
								<li>
									<NavLink to="/servers/add" exact>
										Add server
									</NavLink>
								</li>
							</ul>
						</>
					)}
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
};

export default Navigation;
