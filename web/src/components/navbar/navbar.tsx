import React from "react";
import {
  Box,
  Flex,
  useColorModeValue,
  Link as ChakraLink,
  HStack,
  Text,
  Button,
} from "@chakra-ui/react";
import Link from "next/link";
import { DarkModeSwitch } from "../DarkModeSwitch";
import { useLogoutMutation, useMeQuery } from "../../generated/graphql";
import useIsSSR from "../../utils/isServer";
type Props = {};

const NavBar: React.FC<Props> = () => {
  const [isSSR] = useIsSSR();
  const [{ data, fetching }] = useMeQuery({ pause: isSSR });
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  let body = null;

  if (fetching) {
    // loading
  } else if (!data?.me) {
    // user not logged in
    body = (
      <HStack spacing={3} alignItems="center">
        <Box>
          <Link href="/login">
            <ChakraLink>Login</ChakraLink>
          </Link>
        </Box>
        <Box>
          <Link href="/register">
            <ChakraLink>Register</ChakraLink>
          </Link>
        </Box>
      </HStack>
    );
  } else {
    // user logged in
    body = (
      <Flex alignItems={"center"}>
        <Text mr={3}> {data.me.username} </Text>
        <Button
          colorScheme="red"
          size={"sm"}
          onClick={() => {
            logout();
          }}
        >
          Logout
        </Button>
      </Flex>
    );
  }
  return (
    <Box px={4} bg={useColorModeValue("tan", "gray.800")} color="white">
      <Flex h={16} alignItems="center" justifyContent="space-between" mx="auto">
        <Box>Lireddit</Box>
        {body}
      </Flex>
    </Box>
  );
};

export default NavBar;
