// plugins/redirectToken.client.ts

import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin(() => {
  if (process.client) {
    const { location } = window;

    /**
     * Parses the URL hash into a key-value object.
     * @param hash The URL hash string (without the '#' character).
     * @returns An object containing key-value pairs.
     */
    const parseHash = (hash: string): Record<string, string> => {
      const params: Record<string, string> = {};
      const regex = /([^&=]+)=([^&]*)/g;
      let match: RegExpExecArray | null;

      while ((match = regex.exec(hash)) !== null) {
        const key = decodeURIComponent(match[1]);
        const value = decodeURIComponent(match[2]);
        params[key] = value;
      }

      return params;
    };

    /**
     * Checks if the current pathname is '/admin'.
     * @returns True if on '/admin', else false.
     */
    const isAdminPath = (): boolean => {
      return location.pathname === "/admin";
    };

    /**
     * Finds all parameters ending with '_token'.
     * @param params The parsed hash parameters.
     * @returns An object containing only the token parameters.
     */
    const extractTokenParams = (
      params: Record<string, string>
    ): Record<string, string> => {
      const tokenParams: Record<string, string> = {};
      for (const key in params) {
        if (key.endsWith("_token")) {
          tokenParams[key] = params[key];
        }
      }
      return tokenParams;
    };

    /**
     * Constructs the new hash string from token parameters.
     * @param tokenParams The token parameters to include in the hash.
     * @returns The constructed hash string.
     */
    const constructNewHash = (tokenParams: Record<string, string>): string => {
      const hashArray: string[] = [];
      for (const key in tokenParams) {
        hashArray.push(
          `${encodeURIComponent(key)}=${encodeURIComponent(tokenParams[key])}`
        );
      }
      return `#${hashArray.join("&")}`;
    };

    /**
     * Redirects the user to the '/admin' route with the specified hash.
     * @param newHash The new hash string to append to the URL.
     */
    const redirectToAdmin = (newHash: string): void => {
      const newUrl = `${location.origin}/admin${newHash}`;
      window.location.replace(newUrl);
    };

    // Extract and parse the current hash
    const currentHash = location.hash.substring(1); // Remove the '#' character
    const params = parseHash(currentHash);

    // Extract token parameters (any key ending with '_token')
    const tokenParams = extractTokenParams(params);

    // If any token parameter exists and not already on '/admin'
    if (Object.keys(tokenParams).length > 0 && !isAdminPath()) {
      const newHash = constructNewHash(tokenParams);
      redirectToAdmin(newHash);
    }
  }
});
