import Editor from "@monaco-editor/react";
import AllPages from "./AllPages";
import { ChakraProvider } from '@chakra-ui/react'

function App() {
  // function handleEditorChange(value, event) {
  //   console.log('here is the current model value:', value);
  // }
  const oauthConfig = {
    clientId: '3379cf49d3cc1daee16a',
    clientSecret: '806d8cbf107907f71ecb220d9268ae4fba6f4b52',
    authorizationUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    redirectUri: 'http://127.0.0.1:5173/code',
  };

  return (
    // <ChakraProvider>

    <AllPages />
    // </ChakraProvider>

  )
}

export default App;
