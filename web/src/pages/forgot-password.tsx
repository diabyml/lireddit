import { Box, Heading, Stack, Button, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useRouter } from "next/router";
import Wrapper from "../components/layout/wrapper";
import { Formik } from "formik";
import { Form } from "formik";
import InputField from "../components/form/input-field";
import { withUrqlClient } from "next-urql";

import { createUrqlClient } from "../utils/createUrqlClient";
import { useForgotPasswordMutation } from "../generated/graphql";

const ForgotPassword: React.FC = () => {
  const router = useRouter();
  const [, forgotPassword] = useForgotPasswordMutation();
  const [completed, setCompleted] = useState(false);
  return (
    <Box pt={8}>
      <Wrapper variant="small">
        <Box bgColor="white" padding={8} rounded={"lg"} boxShadow={"lg"}>
          <Heading size={"md"} mb={4} as="h1" textAlign={"center"}>
            Forgot Password
          </Heading>
          {completed ? (
            <Box>
              <Text>
                if an account with that email exists, we sent you an email
              </Text>
            </Box>
          ) : (
            <Formik
              initialValues={{ email: "" }}
              onSubmit={async (values, { setErrors }) => {
                //   console.log(values);
                await forgotPassword(values);
                setCompleted(true);
              }}
            >
              {({ isSubmitting }) => (
                <Form>
                  <Stack spacing={6}>
                    <InputField
                      type="email"
                      label="Email"
                      name="email"
                      placeholder="email"
                    />
                  </Stack>
                  <Box mt={8}>
                    <Button
                      w="100%"
                      type="submit"
                      colorScheme={"messenger"}
                      isLoading={isSubmitting}
                    >
                      FORGOT PASSWORD
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          )}
        </Box>
      </Wrapper>
    </Box>
  );
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
