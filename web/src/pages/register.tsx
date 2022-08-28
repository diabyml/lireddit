import { Formik, Form } from "formik";
import React from "react";
import Wrapper from "../components/layout/wrapper";
import InputField from "../components/form/input-field";
import { Box, Button, Heading, Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";

import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { createUrqlClient } from "../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";

interface Props {}

const Register: React.FC<Props> = () => {
  const router = useRouter();
  const [, register] = useRegisterMutation();
  return (
    <Box
      h={"100vh"}
      bgGradient="linear(135deg, #8BC6EC 0%, #9599E2 100%)"
      pt={8}
    >
      <Wrapper variant="small">
        <Box bgColor="white" padding={8} rounded={"lg"} boxShadow={"lg"}>
          <Heading size={"md"} mb={4} as="h1" textAlign={"center"}>
            Create New Account
          </Heading>
          <Formik
            initialValues={{ email: "", username: "", password: "" }}
            onSubmit={async (values, { setErrors }) => {
              const response = await register({ options: values });
              console.log(response);
              if (response.data?.register.errors) {
                setErrors(toErrorMap(response.data.register.errors));
              } else if (response.data?.register.user) {
                // worked
                router.push("/");
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <Stack spacing={6}>
                  <InputField
                    label="Username"
                    name="username"
                    placeholder="username"
                    // onChange={handleChange}
                  />
                  <InputField
                    label="Email"
                    name="email"
                    placeholder="email"
                    // onChange={handleChange}
                  />
                  <InputField
                    type="password"
                    label="Password"
                    name="password"
                    placeholder="password"
                    // onChange={handleChange}
                  />
                </Stack>
                <Box mt={8}>
                  <Button
                    w="100%"
                    type="submit"
                    colorScheme={"messenger"}
                    isLoading={isSubmitting}
                  >
                    Register
                  </Button>
                </Box>
              </Form>
            )}
          </Formik>
        </Box>
      </Wrapper>
    </Box>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(Register);
