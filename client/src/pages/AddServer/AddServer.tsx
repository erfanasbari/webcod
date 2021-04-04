import { useState } from "react";
import { Redirect, RouteComponentProps } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createSnackbar } from "store/ui";
import { addServer } from "api/servers";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import { checkYupError } from "include/ui";
import { FormControlLabel, Button, TextField, Checkbox } from "@material-ui/core";
import ShowPasswordIcon from "components/ShowPasswordIcon/ShowPasswordIcon";
import { PageTitle } from "components/StyledComponents/StyledComponents";
import GameServerSelect from "./components/GameServerSelect";
import "./AddServer.scss";

const FormSchema = Yup.object().shape({
	appId: Yup.string(),
	name: Yup.string().min(3).max(255),
	host: Yup.string().max(255),
	port: Yup.number().min(0).max(65535),
	rconPassword: Yup.string().max(255),
	dbHost: Yup.string().max(255),
	dbPort: Yup.number().min(0).max(65535),
	dbUser: Yup.string().max(255),
	dbPassword: Yup.string().max(255),
	dbName: Yup.string().max(255),
});

const AddServer = ({ history }: RouteComponentProps) => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);
	const [showRconPassword, setShowRconPassword] = useState(false);
	const [showDbPassword, setShowDbPassword] = useState(false);
	const [hasDb, setHasDb] = useState(false);

	const onFormSubmit = (
		values: AddServerFormValues,
		{ setSubmitting }: FormikHelpers<AddServerFormValues>
	) => {
		addServer({ ...values, dbHost: hasDb ? values.dbHost : "" })
			.then((result) => {
				dispatch(
					createSnackbar({ severity: "success", title: "Success", message: "Server added successfully." })
				);
				history.push("/");
			})
			.catch(({ response }) => {
				if (!response) return;
				dispatch(
					createSnackbar({ severity: "error", title: "Error", message: response.data.errors[0].message })
				);
			})
			.finally(() => {
				setSubmitting(false);
			});
	};

	return (
		<>
			{!user.logged && user.role < 80 && <Redirect to={"/"} />}
			<PageTitle>Add server</PageTitle>
			<section className="add-server">
				<Formik
					initialValues={
						{
							appId: "CoD4x",
							port: 28960,
							dbPort: 3306,
							dbHost: "localhost",
							dbUser: "root",
							dbPassword: "",
							dbName: "",
						} as AddServerFormValues
					}
					onSubmit={onFormSubmit}
					validationSchema={FormSchema}
				>
					{({ isSubmitting, errors }) => (
						<Form>
							<Field
								name="appId"
								type="select"
								autoFocus={true}
								variant="outlined"
								label="Game server"
								className="input"
								color="primary"
								as={GameServerSelect}
								required
							/>
							<Field
								name="name"
								type="text"
								variant="outlined"
								label="Name"
								className="input"
								color="primary"
								as={TextField}
								{...checkYupError(errors.name)}
								required
							/>
							<Field
								name="host"
								type="text"
								variant="outlined"
								label="Host"
								className="input"
								color="primary"
								as={TextField}
								{...checkYupError(errors.host)}
								required
							/>
							<Field
								name="port"
								type="number"
								variant="outlined"
								label="Port"
								className="input"
								color="primary"
								as={TextField}
								{...checkYupError(errors.port)}
								required
							/>
							<Field
								name="rconPassword"
								type={showRconPassword ? "text" : "password"}
								variant="outlined"
								label="Rcon Password"
								className="input"
								color="primary"
								InputProps={{
									endAdornment: (
										<ShowPasswordIcon showPassword={showRconPassword} setShowPassword={setShowRconPassword} />
									),
								}}
								as={TextField}
								{...checkYupError(errors.rconPassword)}
								required
							/>
							<FormControlLabel
								control={<Checkbox checked={hasDb} onChange={() => setHasDb(!hasDb)} color="primary" />}
								label="Has mysql database"
							/>
							{hasDb && (
								<>
									<Field
										name="dbHost"
										type="text"
										variant="outlined"
										label="Database host"
										className="input"
										color="primary"
										as={TextField}
										{...checkYupError(errors.dbHost)}
										required
									/>
									<Field
										name="dbPort"
										type="text"
										variant="outlined"
										label="Database port"
										className="input"
										color="primary"
										as={TextField}
										{...checkYupError(errors.dbPort)}
										required
									/>
									<Field
										name="dbUser"
										type="text"
										variant="outlined"
										label="Database username"
										className="input"
										color="primary"
										as={TextField}
										{...checkYupError(errors.dbUser)}
										required
									/>
									<Field
										name="dbPassword"
										type={showDbPassword ? "text" : "password"}
										variant="outlined"
										label="Database password"
										className="input"
										color="primary"
										InputProps={{
											endAdornment: (
												<ShowPasswordIcon showPassword={showDbPassword} setShowPassword={setShowDbPassword} />
											),
										}}
										as={TextField}
										{...checkYupError(errors.dbPassword)}
									/>

									<Field
										name="dbName"
										type="text"
										variant="outlined"
										label="Database name"
										className="input"
										color="primary"
										as={TextField}
										{...checkYupError(errors.dbName)}
										required
									/>
								</>
							)}

							<Button
								disabled={isSubmitting}
								className="submit"
								type="submit"
								variant="contained"
								size="large"
								color="secondary"
							>
								Add Server
							</Button>
						</Form>
					)}
				</Formik>
			</section>
		</>
	);
};

export default AddServer;
