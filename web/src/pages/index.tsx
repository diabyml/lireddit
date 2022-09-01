import React, { useState } from "react";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import {
  Box,
  Spinner,
  Text,
  Link as ChakraLink,
  Stack,
  Heading,
  Flex,
  Center,
  Button,
} from "@chakra-ui/react";
import { Layout } from "../components/layout/layout";
import Link from "next/link";

const Index = () => {
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = usePostsQuery({
    variables,
  });

  // React.useEffect(() => {
  //   console.log(data);
  // }, [data]);

  if (!data && !fetching) {
    return (
      <Box>
        <Center>
          <Text>
            You got <Text fontWeight="bold">query faialed</Text> for some reason{" "}
          </Text>
        </Center>
      </Box>
    );
  }

  return (
    <Layout>
      <Flex mb={4} alignItems="center" justifyContent="space-between">
        <Heading>LiReddit</Heading>
        <Link href={"/create-post"} passHref>
          <ChakraLink color={"primary"}>Create post</ChakraLink>
        </Link>
      </Flex>
      <Box>
        {!data && fetching ? (
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        ) : (
          <Stack spacing={8}>
            {data!.posts.posts.map((post) => (
              <Box key={post.id} p={5} shadow={"md"} borderWidth={"1px"}>
                <Heading fontSize={"xl"}>{post.title}</Heading>
                <Text mt={4}> {post.textSnippet} </Text>
              </Box>
            ))}
          </Stack>
        )}
      </Box>
      {data && data?.posts.hasMore && (
        <Center pt={8}>
          <Button
            isLoading={fetching}
            onClick={() => {
              setVariables({
                limit: variables.limit,
                cursor: data.posts.posts[data.posts.posts.length - 1].createdAt,
              });
            }}
          >
            Load More
          </Button>
        </Center>
      )}
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
