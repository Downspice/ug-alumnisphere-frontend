import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { getAccessToken } from "@/lib/auth/session";

const GRAPHQL_URI =
  process.env.NEXT_PUBLIC_GRAPHQL_URI || "http://localhost:4000/graphql";

const authLink = new SetContextLink((prevContext) => {
  const token = getAccessToken();
  return {
    headers: {
      ...(prevContext.headers as Record<string, string> | undefined),
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

export function createApolloClient() {
  return new ApolloClient({
    link: authLink.concat(new HttpLink({ uri: GRAPHQL_URI })),
    cache: new InMemoryCache(),
  });
}

export const apolloClient = createApolloClient();
