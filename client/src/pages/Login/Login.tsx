import { useState } from "react";
import { Redirect } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logIn } from "../../store/user";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import { checkYupError } from "../../include/ui";
import { Button, TextField } from "@material-ui/core";
import ShowPasswordIcon from "../../components/ShowPasswordIcon/ShowPasswordIcon";
import { PageTitle } from "../../components/StyledComponents/StyledComponents";
import "./Login.scss";

const SignInSchema = Yup.object().shape({
	username: Yup.string().min(3, "At least 3 characters").max(32, "At most 32 characters"),
	password: Yup.string().min(6, "Must be at least 6 characters"),
});

const Login = () => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);
	const [showPassword, setShowPassword] = useState(false);

	const onFormSubmit = ({ username, password }: LoginFormValues, { setSubmitting }: FormikHelpers<LoginFormValues>) => {
		dispatch(logIn(username, password, () => setSubmitting(false)));
	};

	return (
		<>
			{user.logged && <Redirect to={"/"} />}
			<PageTitle>Login</PageTitle>
			<section className="login">
				<Formik
					initialValues={
						{
							username: "",
							password: "",
						} as LoginFormValues
					}
					onSubmit={onFormSubmit}
					validationSchema={SignInSchema}
				>
					{({ isSubmitting, errors }) => (
						<Form>
							<Field name="username" type="input" autoFocus={true} variant="outlined" label="Username" className="input" color="primary" as={TextField} {...checkYupError(errors.username)} />
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
								{...checkYupError(errors.password)}
							/>
							<Button disabled={isSubmitting} className="submit" type="submit" variant="contained" size="large" color="primary">
								Sign in
							</Button>
						</Form>
					)}
				</Formik>
			</section>
		</>
	);
};

export default Login;
