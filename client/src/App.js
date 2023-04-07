import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import "./App.css";
import User from "./components/User";

function App() {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "http://localhost:5000/graphql",
  });

  return (
    <ApolloProvider client={client}>
      <div className="App">
        <User />
      </div>
    </ApolloProvider>
  );
}

export default App;
