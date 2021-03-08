import { createSlice } from "@reduxjs/toolkit";
import { Color } from "@material-ui/lab";

interface Ui {
	snackbars: Snackbars;
}
interface Snackbars {
	list: Array<Snackbar>;
}
export type Snackbar = {
	id?: number;
	severity: Color;
	title: string;
	message: string;
};

let snackbarsCount = 0;

const slice = createSlice({
	name: "ui",
	initialState: {
		snackbars: {
			list: [],
		},
	} as Ui,
	reducers: {
		createdSnackbar: (ui, action) => {
			ui.snackbars.list.push({ id: snackbarsCount++, ...action.payload });
		},
		deletedStackbar: (ui, action) => {
			ui.snackbars.list.splice(
				ui.snackbars.list.findIndex(({ id }) => id === action.payload),
				1
			);
		},
	},
});

const { createdSnackbar, deletedStackbar } = slice.actions;
export default slice.reducer;

export const createSnackbar = (snackbar: Snackbar) => createdSnackbar(snackbar);
export const deleteSnackbar = (id: number) => deletedStackbar(id);
