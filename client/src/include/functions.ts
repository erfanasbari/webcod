export function getContextModuleSrc(context: __WebpackModuleApi.RequireContext) {
	return context.keys().map((item) => context(item).default);
}
