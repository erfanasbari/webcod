import jsonConfig from "./config.json";

jsonConfig.address.url = `${jsonConfig.address.SSL ? "https" : "http"}://${jsonConfig.address.domain}${jsonConfig.address.port !== 80 ? `:${jsonConfig.address.port}` : ""}`;
const config = {
	...jsonConfig,
};

export default config;
