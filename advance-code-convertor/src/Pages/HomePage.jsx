import React, { useEffect, useState } from 'react';
import { Box, Button, Heading, Text } from '@chakra-ui/react';
import { BsGithub } from "react-icons/bs";
import axios from 'axios';


function HomePage() {
  const [isLoading, setIsLoading] = useState(false)
  function handleLogin() {
    // Replace your GitHub OAuth URL with your actual URL
    window.location.href = "https://github.com/login/oauth/authorize?client_id=3379cf49d3cc1daee16a&redirect_uri=https://advance-code-convertor.vercel.app/code";
  }
  useEffect(() => {
    setIsLoading(true)
    axios.get("https://github-ai-token.onrender.com").then((response) => {
      if (response.data) {
        console.log("done");
        setIsLoading(false);
      }
    }).catch((err) => {
      alert("Error in starting backend")
      console.log("Error in starting backend", err)
    })
  }, [])
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <Heading as="h1" size="2xl" mb="4">
        Welcome to the Code Converter App
      </Heading>
      {isLoading ? <div className='flex flex-col items-center'><span className="loading loading-bars loading-lg"></span><h1>Backend is Deployed on render.com so it might take some time to start the server</h1></div> :

        <div className='flex flex-col items-center'>
          <Text fontSize="lg" mb="8">
            Convert your code and push it to GitHub!
          </Text>

          <Button
            className='flex gap-4'
            onClick={handleLogin}
            colorScheme="gray"
            size="lg"
          >
            Sign In with GitHub <BsGithub size={"30px"} />
          </Button>
          <Box mt="4">
            <Text fontSize="sm" color="gray.600">
              Created by @LaxyaRupeja.
            </Text>
          </Box>
        </div>}
    </div>
  );
}

export default HomePage;
