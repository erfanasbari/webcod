import { useEffect, useState } from "react";
import { getContextModuleSrc } from "include/functions";
import Slider from "react-slick";
import "./AppBackground.scss";

function importAllAppBackgrounds() {
	const context = require.context("assets/images/app-background/", false, /\.(png|jpe?g|svg)$/);
	return getContextModuleSrc(context);
}

const sliderSettings = {
	dots: false,
	autoplay: true,
	fade: true,
	autoplaySpeed: 10000,
	infinite: true,
	speed: 3000,
	slidesToShow: 1,
	slidesToScroll: 1,
};

const AppBackground = () => {
	const [images, setImages] = useState([""]);
	useEffect(() => {
		setImages(importAllAppBackgrounds());
	}, []);

	return (
		<>
			<Slider className="app-background-slider" {...sliderSettings}>
				{images.map((image, index) => (
					<div className="item" key={index}>
						<img src={image} alt="" />
					</div>
				))}
			</Slider>
		</>
	);
};

export default AppBackground;
