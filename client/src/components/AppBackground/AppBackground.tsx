import { useEffect, useState } from "react";
import { getContextModuleSrc } from "include/functions";
import "./AppBackground.scss";

function importAllAppBackgrounds() {
	const context = require.context("assets/images/app-background/", false, /\.(png|jpe?g|svg)$/);
	return getContextModuleSrc(context);
}

export default function AppBackground() {
	const [images, setImages] = useState([""]);
	useEffect(() => {
		setImages(importAllAppBackgrounds());
	}, []);

	return <></>;
}
