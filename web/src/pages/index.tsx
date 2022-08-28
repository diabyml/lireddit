import { DarkModeSwitch } from "../components/DarkModeSwitch";
import NavBar from "../components/navbar/navbar";

import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import { Box, Spinner, Text } from "@chakra-ui/react";

const Index = () => {
  const [{ data }] = usePostsQuery();
  return (
    <div>
      <NavBar />
      <Box>
        {!data ? (
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.500"
            size="xl"
          />
        ) : (
          data.posts.map((post) => (
            <Box key={post.id}>
              <Text>{post.title}</Text>
            </Box>
          ))
        )}
      </Box>
    </div>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
