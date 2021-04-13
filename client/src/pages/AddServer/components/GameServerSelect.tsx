import React, { useState } from "react";
import loadash from "lodash";
import { FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";

interface GameServerSelectProps {
  label: string;
}

const FormSelect = ({ label, ...rest }: GameServerSelectProps) => {
  const [id] = useState(loadash.uniqueId("FormSelect-"));

  return (
    <FormControl style={{ width: "100%" }}>
      <InputLabel id={id}>{label}</InputLabel>
      <Select {...rest} style={{ background: "#ffffff" }}>
        <MenuItem value="CoD4x">CoD4x</MenuItem>
      </Select>
    </FormControl>
  );
};

export default FormSelect;
