import { useState } from "react";
import { Redirect, RouteComponentProps } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createSnackbar } from "store/ui";
import { addServer } from "api/servers";
import { Formik, Form, Field, FormikHelpers } from "formik";
import * as Yup from "yup";
import { checkYupError } from "include/ui";
import { FormControlLabel, Button, Checkbox } from "@material-ui/core";
import { TextInput } from "components/material-ui";
import { PageTitle } from "components/StyledComponents/StyledComponents";
import GameServerSelect from "./components/GameServerSelect";

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
  const [hasDb, setHasDb] = useState(false);

  const onFormSubmit = (values: AddServerFormValues, { setSubmitting }: FormikHelpers<AddServerFormValues>) => {
    addServer({ ...values, dbHost: hasDb ? values.dbHost : "" })
      .then((result) => {
        dispatch(createSnackbar({ severity: "success", title: "Success", message: "Server added successfully." }));
        history.push("/");
      })
      .catch(({ response }) => {
        if (!response) return;
        dispatch(createSnackbar({ severity: "error", title: "Error", message: response.data.errors[0].message }));
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
              <Field name="name" type="text" label="Name" as={TextInput} {...checkYupError(errors.name)} required />
              <Field name="host" label="Host" as={TextInput} {...checkYupError(errors.host)} required />
              <Field name="port" type="number" label="Port" as={TextInput} {...checkYupError(errors.port)} required />
              <Field
                name="rconPassword"
                type="password"
                label="Rcon Password"
                showPasswordIcon={true}
                as={TextInput}
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
                    label="Database host"
                    as={TextInput}
                    {...checkYupError(errors.dbHost)}
                    required
                  />
                  <Field
                    name="dbPort"
                    type="number"
                    label="Database port"
                    as={TextInput}
                    {...checkYupError(errors.dbPort)}
                    required
                  />
                  <Field
                    name="dbUser"
                    type="text"
                    label="Database username"
                    as={TextInput}
                    {...checkYupError(errors.dbUser)}
                    required
                  />
                  <Field
                    name="dbPassword"
                    type="password"
                    label="Database password"
                    showPasswordIcon={true}
                    as={TextInput}
                    {...checkYupError(errors.dbPassword)}
                  />

                  <Field
                    name="dbName"
                    label="Database name"
                    as={TextInput}
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
