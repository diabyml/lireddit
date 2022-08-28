// export const isServer = () =>  typeof window === "undefined";  //Not working
// Its causing hydartion error

import { useState, useEffect } from "react";

const useIsSSR = () => {
  const [isSSR, setIsSSR] = useState(true);

  useEffect(() => {
    setIsSSR(false);
  }, []);

  return [isSSR];
};

export default useIsSSR;
