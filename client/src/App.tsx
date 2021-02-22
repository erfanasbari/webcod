import React from "react";
import { Switch, Route } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Navigation from "./components/Navigation/Navigation";
import Home from "./pages/Home/Home";
import AppBackground from "./components/AppBackground/AppBackground";
import "./App.scss";

export default function App() {
	return (
		<>
			<AppBackground />
			<div className="app">
				<Navigation />
				<section className="app-page">
					<main className="main-content">
						<Switch>
							<Route path="/" exact component={Home} />
						</Switch>
					</main>
				</section>
			</div>
		</>
	);
}
