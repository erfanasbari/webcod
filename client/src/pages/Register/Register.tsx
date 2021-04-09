import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "store/user";
import { Redirect } from "react-router-dom";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import { checkYupError } from "include/ui";
import { Button } from "@material-ui/core";
import { TextInput } from "components/material-ui";
import { PageTitle } from "components/StyledComponents/StyledComponents";
import "./Register.scss";

const RegisterSchema = Yup.object().shape({
	username: Yup.string().min(3, "At least 3 characters").max(32, "At most 32 characters"),
	email: Yup.string().email(),
	password: Yup.string().min(6, "Must be at least 6 characters"),
	repeatPassword: Yup.string().test("passwords-match", "Passwords must match", function (value) {
		return this.parent.password === value;
	}),
});

const Register = () => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);

	const handleSubmitRegister = (
		{ username, email, password }: RegisterFormValues,
		{ setSubmitting }: FormikHelpers<RegisterFormValues>
	) => {
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
					initialValues={{} as RegisterFormValues}
					onSubmit={handleSubmitRegister}
					validationSchema={RegisterSchema}
				>
					{({ isSubmitting, errors }) => (
						<Form>
							<Field
								name="username"
								autoFocus={true}
								label="Username"
								as={TextInput}
								{...checkYupError(errors.username)}
								required
							/>
							<Field
								name="email"
								type="email"
								label="Email"
								color="primary"
								as={TextInput}
								{...checkYupError(errors.email)}
								required
							/>
							<Field
								name="password"
								showPasswordIcon={true}
								label="Password"
								color="primary"
								as={TextInput}
								{...checkYupError(errors.password)}
								required
							/>
							<Field
								name="repeatPassword"
								type="password"
								label="Repeat password"
								color="primary"
								as={TextInput}
								{...checkYupError(errors.repeatPassword)}
								required
							/>
							<Button
								disabled={isSubmitting}
								className="submit"
								type="submit"
								variant="contained"
								size="large"
								color="secondary"
							>
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
