import { Dispatch, SetStateAction } from "react";
import { InputAdornment, IconButton } from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";

const ShowPasswordIcon = ({ showPassword, setShowPassword }: { showPassword: boolean; setShowPassword: Dispatch<SetStateAction<boolean>> }) => {
	const handleClick = () => {
		setShowPassword(!showPassword);
	};
	return (
		<InputAdornment position="end">
			<IconButton aria-label="toggle password visibility" onClick={handleClick}>
				{showPassword ? <Visibility /> : <VisibilityOff />}
			</IconButton>
		</InputAdornment>
	);
};

export default ShowPasswordIcon;
