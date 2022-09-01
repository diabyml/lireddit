import { Box } from "@chakra-ui/react";
import React from "react";
import Wrapper, { WrapperVariant } from "../layout/wrapper";
import NavBar from "../navbar/navbar";

interface LayoutProps {
  variant?: WrapperVariant;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children, variant }) => {
  return (
    <>
      <NavBar />
      <Box pb={20}></Box>
      <Wrapper variant={variant}>{children}</Wrapper>
      <Box pt={20}></Box>
    </>
  );
};
