import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { useField } from "formik";
import React from "react";

type Props = React.HTMLAttributes<HTMLInputElement | HTMLTextAreaElement> & {
  type?: string;
  name: string;
  label: string;
  textarea?: boolean;
};

const InputField: React.FC<Props> = ({ textarea, ...props }) => {
  const [field, { error }] = useField(props);
  let InputFieldComponent: typeof Input | typeof Textarea = Input;
  if (textarea) {
    InputFieldComponent = Textarea;
  }
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}> {props.label} </FormLabel>
      <InputFieldComponent
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
