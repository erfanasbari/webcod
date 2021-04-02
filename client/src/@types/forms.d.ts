interface RegisterFormValues {
	username: string;
	password: string;
	repeatPassword: string;
	email: string;
}

interface LoginFormValues {
	username: string;
	password: string;
}

interface AddServerFormValues {
	appId: string;
	name: string;
	host: string;
	port: number;
	rconPassword: string;
	dbHost: string;
	dbPort: number;
	dbUser: string;
	dbPassword: string;
	dbName: string;
}
