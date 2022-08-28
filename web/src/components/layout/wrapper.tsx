import { Box } from "@chakra-ui/react";
import React from "react";

interface Props {
  children: React.ReactNode;
  variant?: "small" | "regular";
}

const Wrapper: React.FC<Props> = ({ children, variant = "regular" }) => {
  return (
    <Box maxWidth={variant === "small" ? "400px" : "800px"} mx={"auto"} px={4}>
      {children}
    </Box>
  );
};

export default Wrapper;
