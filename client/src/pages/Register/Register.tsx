import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../../store/user";
import { Redirect } from "react-router-dom";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { Button, TextField } from "@material-ui/core";
import ShowPasswordIcon from "../../components/ShowPasswordIcon/ShowPasswordIcon";
import { PageTitle } from "../../components/StyledComponents/StyledComponents";
import "./Register.scss";

interface RegisterFormValues {
	username: string;
	password: string;
	repeatPassword: string;
	email: string;
}

const Register = () => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);
	const [showPassword, setShowPassword] = useState(false);

	const handleSubmitRegister = ({ username, email, password }: RegisterFormValues, { setSubmitting }: FormikHelpers<RegisterFormValues>) => {
		dispatch(
			register(username, password, email, () => {
				setSubmitting(false);
			})
		);
	};

	return (
		<>
			{user.logged && <Redirect to={"/"} />}
			<PageTitle>Register</PageTitle>
			<section className="register">
				<Formik
					initialValues={
						{
							username: "",
							email: "",
							password: "",
							repeatPassword: "",
						} as RegisterFormValues
					}
					onSubmit={handleSubmitRegister}
				>
					{({ isSubmitting }) => (
						<Form>
							<Field name="username" type="input" autoFocus={true} variant="outlined" label="Username" className="input" color="primary" as={TextField} />
							<Field name="email" type="email" variant="outlined" label="Email" className="input" color="primary" as={TextField} />
							<Field
								name="password"
								type={showPassword ? "text" : "password"}
								variant="outlined"
								label="Password"
								className="input"
								color="primary"
								as={TextField}
								InputProps={{
									endAdornment: <ShowPasswordIcon showPassword={showPassword} setShowPassword={setShowPassword} />,
								}}
							/>
							<Field name="repeatPassword" type="password" variant="outlined" label="Repeat password" className="input" color="primary" as={TextField} />
							<Button disabled={isSubmitting} className="submit" type="submit" variant="contained" size="large" color="secondary">
								Register
							</Button>
						</Form>
					)}
				</Formik>
			</section>
		</>
	);
};

export default Register;
