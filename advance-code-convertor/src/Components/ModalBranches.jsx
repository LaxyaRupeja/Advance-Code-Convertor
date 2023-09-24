// ... (previous code)
import { useEffect, useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Select,
  ModalCloseButton,
  Button,
  Input,
  Divider,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';

const MyModal = ({ isOpen, onClose, code, gitToken }) => {
  const [step, setStep] = useState(1);
  const [repo, setRepo] = useState("");
  const [fileName, setFileName] = useState('');
  const [branchName, setBranchName] = useState('');
  const [branches, setBranches] = useState([]);
  const [commitMessage, setCommitMessage] = useState('');
  const [repos, setRepos] = useState([])
  const [ownerName, setOwnerName] = useState(null);
  const accessToken = localStorage.getItem('token') || gitToken;
  const toast = useToast();
  // const repos = ["Repo 1", "Repo 2", "Repo 3"]; // Replace with your actual repo data
  // const branches = ["Branch 1", "Branch 2", "Branch 3"]; // Replace with your actual branch data

  const nextStep = () => {
    setStep(step + 1);
  };

  const previousStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = () => {
    // const axios = require('axios');
    const data = {
      accessToken: accessToken,
      brandName: branchName,
      fileContent: code,
      fileName: fileName,
      owner: ownerName,
      repo: repo,
      commitMessage: commitMessage
    };

    const url = "https://github-ai-token.onrender.com/push";

    axios.post(url, data)
      .then(response => {
        console.log('Response:', response.data);
        if (response.data.isSuccess) {
          toast({
            title: 'File created!👍.',
            description: "Please check your github repos😀",
            status: 'success',
            duration: 4000,
            isClosable: true,
          })
        }
        else {
          alert("error")
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });

    console.log('Repo:', repo);
    console.log('Branch Name:', branchName);
    console.log('Commit Message:', commitMessage);
    console.log('Code:', code);

    setStep(1);
    setRepo('');
    setFileName('');
    setBranchName('');
    setCommitMessage('');
    onClose();
  };
  useEffect(() => {
    if (accessToken) {

      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      axios.get('https://api.github.com/user/repos', { headers })
        .then((response) => {
          console.log('User Repositories:', response.data);
          setRepos(response.data);
        })
        .catch((error) => {
          console.error('Error fetching user repositories:', error);
        });
    }

  }, [gitToken, accessToken]);
  function handleRepoChange(name) {
    const selectedRepository = repos.find((repoOption) => repoOption.name === name);
    setRepo(name);
    axios
      .get(`https://api.github.com/repos/${selectedRepository.owner.login}/${name}/branches`)
      .then((response) => {
        console.log(response.data)
        setBranches(response.data)
        setOwnerName(selectedRepository.owner.login);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Push Convert Code in Github</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {step === 1 && (
            <>
              <h3>Select a Repository:</h3>
              <Select
                placeholder="Select a Repository"
                value={repo}
                onChange={(e) => handleRepoChange(e.target.value)}
              >
                {repos.map((repoOption) => (
                  <option key={repoOption.id} value={repoOption.name}>
                    {repoOption.name}
                  </option>
                ))}
              </Select>
              <Divider mb={5} />
              <Button onClick={nextStep}>Next</Button>
            </>
          )}
          {step === 2 && (
            <>
              <h3>Select a Branch:</h3>
              <Select
                placeholder="Select a Branch"
                value={branchName}
                onChange={(e) => setBranchName(e.target.value)}
              >
                {branches.map((branchOption) => (
                  <option key={branchOption.name} value={branchOption.name}>
                    {branchOption.name}
                  </option>
                ))}
              </Select>
              <Divider mb={5} />
              <Button onClick={previousStep}>Previous</Button>
              <Button onClick={nextStep} ml={3}>Next</Button>
            </>
          )}
          {step === 3 && (
            <>
              <h3>Enter File Name with extension</h3>
              <Input
                placeholder="convertCode.js"
                mb={3}
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
              />
              <h4>If you want push in specific folder please add Path before the file Name</h4>
              <Divider mb={5} />
              <Button onClick={previousStep}>Previous</Button>
              <Button onClick={nextStep} ml={3}>Next</Button>
            </>
          )}
          {step === 4 && (
            <>
              <h3>Commit Message:</h3>
              <Input
                placeholder="Commit Message"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
              />
              <Divider mb={5} />
              <Button onClick={previousStep}>Previous</Button>
              <Button onClick={nextStep} ml={3}>Next</Button>
            </>
          )}
          {step === 5 && (
            <>
              <div>
                <h2 className="text-2xl mb-4">Review Your Selections</h2>
                <div className="mb-4">
                  <h3 className="text-lg">Repository:</h3>
                  <p className="text-gray-700">{repo}</p>
                </div>
                <div className="mb-4">
                  <h3 className="text-lg">Branch:</h3>
                  <p className="text-gray-700">{branchName}</p>
                </div>
                <div className="mb-4">
                  <h3 className="text-lg">Commit Message:</h3>
                  <p className="text-gray-700">{commitMessage}</p>
                </div>
                <div className="mb-4">
                  <h3 className="text-lg">Code:</h3>
                  <Textarea
                    value={code}
                    readOnly
                    className="border p-2 rounded w-full bg-gray-100"
                    rows={5}
                  />
                </div>
                <Divider mb={5} />
                <div className="flex justify-between">
                  <Button onClick={previousStep}>Previous</Button>
                  <Button onClick={handleSubmit} colorScheme="blue">
                    Push
                  </Button>
                </div>
              </div>
            </>
          )}

        </ModalBody>
        <ModalFooter>
          Step {step} of 5
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MyModal;