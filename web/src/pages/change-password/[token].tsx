import {useState} from 'react';
import { Alert, AlertDescription, AlertIcon, AlertTitle, Box, Button, Heading, Stack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import { useRouter } from "next/router";

import InputField from "../../components/form/input-field";
import Wrapper from "../../components/layout/wrapper";
import { useChangePasswordMutation } from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";
import { withUrqlClient } from 'next-urql';
import { createUrqlClient } from '../../utils/createUrqlClient';

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
    const [tokenError, setTokenError] = useState('');
  const router = useRouter();
  const [, changePassword] = useChangePasswordMutation();
  return (
    <Box pt={8}>
      <Wrapper variant="small">
        <Box bgColor="white" padding={8} rounded={"lg"} boxShadow={"lg"}>
          <Heading size={"md"} mb={4} as="h1" textAlign={"center"}>
            Change Password
          </Heading>
          <Formik
            initialValues={{ newPassword: "" }}
            onSubmit={async (values, { setErrors }) => {
              //   console.log(values);
              const response = await changePassword({
                newPassword: values.newPassword,
                token,
              });

              if (response.data?.changePassword.errors) {
                const errorMap: any = toErrorMap(
                  response.data?.changePassword.errors
                );
                setTokenError(errorMap.token);
                setErrors(errorMap);
              } else if (response.data?.changePassword.user) {
                router.push("/");
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <Stack spacing={6}>
                  <InputField
                    type="password"
                    label="New Password"
                    name="newPassword"
                    placeholder="new password"
                  />
                  <Box>
                    {tokenError && (
                      <Alert status="error">
                        <AlertIcon />
                        <AlertTitle>Token</AlertTitle>
                        <AlertDescription>
                          {tokenError}
                        </AlertDescription>
                      </Alert>
                    )}
                  </Box>
                </Stack>
                <Box mt={8}>
                  <Button
                    w="100%"
                    type="submit"
                    colorScheme={"messenger"}
                    isLoading={isSubmitting}
                  >
                    CHANGE PASSWORD
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

ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

export default  withUrqlClient(createUrqlClient,{ ssr: false })(ChangePassword);
