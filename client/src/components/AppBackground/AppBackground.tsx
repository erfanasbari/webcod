import { useEffect, useState } from "react";
import { getContextModuleSrc } from "include/functions";
import "./AppBackground.scss";

const importAllAppBackgrounds = () => {
	const context = require.context("assets/images/app-background/", false, /\.(png|jpe?g|svg)$/);
	return getContextModuleSrc(context);
};

const AppBackground = () => {
	const [images, setImages] = useState([""]);
	useEffect(() => {
		setImages(importAllAppBackgrounds());
	}, []);

	return <></>;
};

export default AppBackground;
