import { useState } from "react";
import { Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../../store/user";
import { createSnackbar } from "../../store/ui";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { Button, TextField } from "@material-ui/core";
import authApi from "../../api/auth";
import ShowPasswordIcon from "../../components/ShowPasswordIcon/ShowPasswordIcon";
import { PageTitle } from "../../components/StyledComponents/StyledComponents";
import "./Login.scss";

interface Values {
	username: string;
	password: string;
}

const Login = () => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);
	const [showPassword, setShowPassword] = useState(false);

	const onFormSubmit = ({ username, password }: Values, { setSubmitting }: FormikHelpers<Values>) => {
		authApi
			.login(username, password)
			.then((result) => {
				dispatch(updateUser({ logged: true, username }));
				dispatch(createSnackbar({ severity: "success", title: "Success", message: "Successfully logged in." }));
			})
			.catch(({ response }) => {
				dispatch(createSnackbar({ severity: "error", title: "Error", message: response.data.errors[0].message }));
			})
			.finally(() => {
				setSubmitting(false);
			});
	};

	return (
		<>
			{user.logged && <Redirect to={"/"} />}
			<PageTitle>Login</PageTitle>
			<section className="login">
				<Formik
					initialValues={{
						username: "",
						password: "",
					}}
					onSubmit={onFormSubmit}
				>
					{({ isSubmitting }) => (
						<Form>
							<Field name="username" type="input" autoFocus={true} variant="outlined" label="Username" className="input" color="primary" as={TextField} />
							<Field
								name="password"
								type={showPassword ? "text" : "password"}
								variant="outlined"
								label="Password"
								className="input"
								color="primary"
								InputProps={{
									endAdornment: <ShowPasswordIcon showPassword={showPassword} setShowPassword={setShowPassword} />,
								}}
								as={TextField}
							/>
							<Button disabled={isSubmitting} className="submit" type="submit" variant="contained" size="large" color="primary">
								{isSubmitting ? "true" : "false"}
							</Button>
						</Form>
					)}
				</Formik>
			</section>
		</>
	);
};

export default Login;
