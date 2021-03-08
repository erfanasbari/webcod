import { useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./api/auth";
import { updateUser } from "./store/user";
import Navigation from "./components/Navigation/Navigation";
import AppBackground from "./components/AppBackground/AppBackground";
import AppSnackbar from "./components/AppSnackbar/AppSnackbar";
import "./App.scss";

// Pages
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";

export default function App() {
	const dispatch = useDispatch();
	const snackBars = useSelector((state) => state.ui.snackbars);

	useEffect(() => {
		getUser()
			.then((result) => {
				dispatch(
					updateUser({
						logged: true,
						username: result.data.username,
						email: result.data.email,
						role: result.data.role,
					})
				);
			})
			.catch(({ response }) => {
				console.log(response);
			});
	}, []);

	return (
		<>
			<AppBackground />
			<div className="app">
				<Navigation />
				<section className="app-page">
					<main className="main-content">
						<Switch>
							<Route path="/" exact component={Home} />
							<Route path="/login" exact component={Login} />
						</Switch>
					</main>
				</section>
				{snackBars.list.map((snackbar) => (
					<AppSnackbar key={snackbar.id} snackbar={snackbar} />
				))}
			</div>
		</>
	);
}
