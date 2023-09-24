import { useEffect, useState } from "react";
import axios from "axios";
import Editor from '@monaco-editor/react';
import { BsGithub } from "react-icons/bs";
import MyModal from "../Components/ModalBranches";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@chakra-ui/react";
import { useToast } from '@chakra-ui/react'
function CodeConvertor() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toast = useToast()
  const nav = useNavigate();
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("");
  const [githubToken, setGithubToken] = useState(null)
  const [isLoading, setIsLoading] = useState(false);


  async function handleCodeConvert() {
    console.log("started..")
    setIsLoading(true);
    if (!code) {
      toast({
        title: `Please write some code first!`,
        status: "error",
        isClosable: true,
      })
      setIsLoading(false)
      return;
    }
    if (!language) {
      toast({
        title: `Please select a language to convert`,
        status: "error",
        isClosable: true,
      })
      setIsLoading(false)
      return;
    }
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [{
          role: "user",
          content: `Please convert the Following code snippet into ${language},Make sure to only give response as convert code nothing else for Example if i ask you to convert 'console.log("Hello")' this into java your response should be only 'System.out.println("Hello");' this not anything else Here is the code that you have to convert ${code}`
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_KEY}`,
        },
      }
    );
    console.log(response.data);
    let data = response.data.choices[0].message.content;
    setOutput(data);
    setIsLoading(false);
  }
  async function handleCodeQualityCheck() {
    setIsLoading(true);
    if (!code) {
      toast({
        title: `Please write some code first!`,
        status: "error",
        isClosable: true,
      })
      setIsLoading(false)
      return;
    }
    console.log("started..")
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [{
          role: "user",
          content: `Please check the Quality Following code snippet,Make sure to give all the required feedback to make this code better also at the end of your response also provide a rating out of 10. Here is the code that you have to Quality check and provide rating ${code}`
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_KEY}`,
        },
      }
    );
    console.log(response.data);
    let data = response.data.choices[0].message.content;
    setOutput(data);
    setIsLoading(false);

  }
  async function handleCodeDebug() {
    console.log("started..")
    setIsLoading(true);
    if (!code) {
      toast({
        title: `Please write some code first!`,
        status: "error",
        isClosable: true,
      })
      setIsLoading(false)
      return;
    }
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [{
          role: "user",
          content: `Please debug the Following code snippet,Make sure to Give the Updated Code which is correct version of the previous code and also point out all the mistakes that the code has and also tell what have you did to solve that mistake .Here is the code that you have to debug ${code}`
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_KEY}`,
        },
      }
    );
    console.log(response.data);
    let data = response.data.choices[0].message.content;
    setOutput(data);
    setIsLoading(false);

  }
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      axios.get("https://github-ai-token.onrender.com/getToken?code=" + code).then((response) => {
        console.log(response.data);
        localStorage.setItem("token", response.data.access_token)
        setGithubToken(response.data.access_token)
        if (response.data.access_token) {
          toast({
            title: 'Logged In.',
            description: "Github logging successful!!",
            status: 'success',
            duration: 4000,
            isClosable: true,
          })
        }
        else {
          toast({
            title: 'Some error occurred',
            description: "error in getting your information from github. Please Re-Login",
            status: 'error',
            duration: 9000,
            isClosable: true,
          })
        }

      })
    } else {
      console.error('GitHub OAuth callback: Missing code parameter');
    }
  }, []);
  function handleEditorChange(value, event) {
    console.log(value);
    setCode(value);
  }
  function handleModalOpen() {
    if (localStorage.getItem("token") != "undefined") {
      openModal();
    }
    else {
      toast({
        title: 'Error getting in token.',
        description: "Please re-login once again!",
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
    }
  }
  // console.log(selectedRepo)
  return (
    <>

      <h1 className="text-4xl font-bold text-center mb-5">Code Convertor/Debugger/Quality Checker</h1>
      <p className="text-center mb-3">If something is not working please re-login <button onClick={() => nav("/")} className="btn">RE-LOGIN</button></p>
      <main className="flex w-full h-[90vh] justify-center gap-3 px-5">
        <div className="flex flex-col gap-4 w-[20%]">
          <select onChange={(e) => setLanguage(e.target.value)} className="select select-bordered w-full max-w-xs">
            <option disabled selected>Select Language</option>
            <option value={"Javascript"}>Javascript</option>
            <option value={"Python"}>Python</option>
            <option value={"Java"}>Java</option>
          </select>
          <button className="btn btn-primary" onClick={handleCodeConvert}>{language ? "CONVERT TO " + language : "CONVERT"}</button>
          <button className="btn btn-secondary" onClick={handleCodeDebug}>DEBUG</button>
          <button className="btn btn-neutral" onClick={handleCodeQualityCheck}>QUALITY CHECK</button>
          <button className="btn btn-accent" onClick={() => setCode("")}>CLEAR CODE</button>
          <button className="btn" onClick={handleModalOpen}>PUSH CODE IN GITHUB <BsGithub size={"30px"} /></button>

        </div>
        <div className="flex w-[80%]">

          <div className="text-2xl h-[90vh] border-r  rounded-lg w-[50%] relative flex flex-col">
            <button className="btn">
              Input
            </button>
            <Editor height="90vh" defaultLanguage="javascript" theme="vs-dark" value={code} defaultValue="// Code Here" onChange={handleEditorChange} />
          </div>
          <div className="h-[90vh] border-l rounded-lg w-[50%] relative flex flex-col">
            {isLoading ? <div className="flex flex-col w-full h-full justify-center items-center"><span className="loading loading-spinner loading-lg"></span></div> :
              <div className="flex flex-col w-full h-full">
                <button className="btn">
                  Output
                </button>
                {/* <Editor height="90vh" defaultLanguage="javascript" theme="vs-dark" defaultValue="// Output will appear here" value={output} /> */}
                <Textarea

                  color={"black"}
                  height={"100%"}
                  placeholder="Output will appear here"
                  className="" // Add resize-none class

                  value={output}// Set the initial number of rows
                />
              </div>

            }
          </div>
        </div>
        <MyModal isOpen={isModalOpen} onClose={closeModal} code={output} gitToken={githubToken} />
      </main >
    </>
  )
}

export default CodeConvertor