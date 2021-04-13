import { useState, SyntheticEvent } from "react";
import { useDispatch } from "react-redux";
import { deleteSnackbar, Snackbar as SnackbarType } from "store/ui";
import { Snackbar } from "@material-ui/core";
import { AlertTitle, Alert } from "@material-ui/lab";

const AppSnackbar = ({ snackbar }: { snackbar: SnackbarType }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(true);
  const { id, severity, title, message } = snackbar;

  const handleClose = (e: SyntheticEvent, reason: string) => {
    if (reason === "clickaway") return;
    setOpen(false);
    setTimeout(() => {
      dispatch(deleteSnackbar(id as number));
    }, 300);
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        autoHideDuration={3000}
        open={open}
        onClose={handleClose}
      >
        <Alert severity={severity}>
          <AlertTitle>{title}</AlertTitle>
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AppSnackbar;
