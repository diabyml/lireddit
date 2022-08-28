import { Formik, Form } from "formik";
import React from "react";
import Wrapper from "../components/layout/wrapper";
import InputField from "../components/form/input-field";
import { Box, Button, Heading, Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import NextLink from 'next/link';

import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

interface Props {}

const Login: React.FC<Props> = () => {

  const router = useRouter();
  const [, login] = useLoginMutation();
  return (
    <Box
      h={"100vh"}
      bgGradient="linear(135deg, #8BC6EC 0%, #9599E2 100%)"
      pt={8}
    >
      <Wrapper variant="small">
        <Box bgColor="white" padding={8} rounded={"lg"} boxShadow={"lg"}>
          <Heading size={"md"} mb={4} as="h1" textAlign={"center"}>
            Connect to your account
          </Heading>
          <Formik
            initialValues={{ usernameOrEmail: "", password: "" }}
            onSubmit={async (values, { setErrors }) => {
              const response = await login(values);
              console.log(response);
              if (response.data?.login.errors) {
                setErrors(toErrorMap(response.data.login.errors));
              } else if (response.data?.login.user) {
                // worked
                router.push("/");
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <Stack spacing={6}>
                  <InputField
                    label="Username or Email"
                    name="usernameOrEmail"
                    placeholder="username or email"
                    // onChange={handleChange}
                  />
                  <InputField
                    type="password"
                    label="Password"
                    name="password"
                    placeholder="password"
                    // onChange={handleChange}
                  />
                  <Box>
                    <NextLink href={"/forgot-password"} >Forgot password?</NextLink>
                  </Box>
                </Stack>
                <Box mt={8}>
                  <Button
                    w="100%"
                    type="submit"
                    colorScheme={"messenger"}
                    isLoading={isSubmitting}
                  >
                    Login
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

export default withUrqlClient(createUrqlClient, { ssr: false })(Login);
