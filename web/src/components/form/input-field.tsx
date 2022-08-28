import React from "react";
import { FormControl, FormErrorMessage } from "@chakra-ui/react";
import { FormLabel } from "@chakra-ui/react";
import { Input } from "@chakra-ui/react";
import { useField } from "formik";

type Props = React.HTMLAttributes<HTMLInputElement> & {
  type?: string;
  name: string;
  label: string;
};



const InputField: React.FC<Props> = (props) => {
  const [field, { error }] = useField(props);
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}> {props.label} </FormLabel>
      <Input
        id={field.name}
        placeholder={props.placeholder}
        {...props}
        {...field}
      />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default InputField;
