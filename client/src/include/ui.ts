export const checkYupError = (error: string | undefined) => {
	if (!error) return;
	return {
		error: true,
		helperText: error,
	};
};
