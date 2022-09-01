import { Box, Button, Stack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React from "react";

import { withUrqlClient } from "next-urql";
import InputField from "../components/form/input-field";
import { Layout } from "../components/layout/layout";
import { useCreatePostMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import useIsAuth from "../utils/useIsAuth";

const CreatePost: React.FC = () => {
  useIsAuth();
  const router = useRouter();
  const [, createPost] = useCreatePostMutation();
  

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await createPost({ input: values });
          console.log(response);
          if (!response.error) {
            console.log("No error occured");
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Stack spacing={6}>
              <InputField label="Title" name="title" placeholder="title" />
              <InputField
                type="textarea"
                label="Body"
                name="text"
                placeholder="text..."
                textarea
              />
            </Stack>
            <Box mt={8}>
              <Button
                w="100%"
                type="submit"
                colorScheme={"messenger"}
                isLoading={isSubmitting}
              >
                CREATE POST
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(CreatePost);
