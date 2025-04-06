const axios = require('axios');
const express = require('express');
const app = express();

const GITHUB_TOKEN = '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';
const REPO_OWNER = 'NetTable';
const REPO_NAME = 'NetTable.github.io';
const FILE_PATH = 'NetTable/Servers/';

app.use(express.json());

app.post('/createFile', async (req, res) => {
  const fileName = req.body.name;
  const fileContent = req.body.content || '';

  if (!fileName) {
    return res.json({
      status: false,
      message: 'File name is required. Please ensure that you are sending the "name" parameter in the request body. This parameter should specify the desired file name.',
      solution: 'To fix this issue: \n1. Verify the structure of your request body. Ensure it contains a "name" key.\n2. Use tools like Postman or cURL to test your API request. \n3. Check your client-side application code if you are making this request programmatically.'
    });
  }

  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${FILE_PATH}${fileName}`;
  const data = {
    message: `Create file ${fileName}`,
    content: Buffer.from(fileContent).toString('base64'),
    branch: 'main'
  };

  try {
    const response = await axios.put(url, data, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    res.json({
      status: true,
      message: "File created successfully.",
      github: "https://github.com/NetTable",
      dev_github: "https://github.com/DevLeox",
      dev_telegram: "https://t.me/LeoxJava"
    });
  } catch (error) {
    let detailedMessage = 'An unexpected error occurred.';
    let solution = 'Please review your request and try the following steps:';

    if (error.response) {
      detailedMessage = error.response.data.message || detailedMessage;

      if (error.response.status === 401) {
        solution += '\n1. Ensure your GitHub token is valid and has the necessary permissions (repo scope).';
      } else if (error.response.status === 404) {
        solution += '\n1. Verify the repository and file path exist.';
        solution += '\n2. Check if the branch you specified is correct (e.g., "main").';
      } else if (error.response.status === 422) {
        solution += '\n1. Make sure the file does not already exist. GitHub API cannot overwrite existing files without additional handling.';
      } else {
        solution += '\n1. Check GitHub API documentation for error details.';
      }
    } else if (error.request) {
      detailedMessage = 'Network error occurred while communicating with GitHub.';
      solution += '\n1. Check your internet connection.';
      solution += '\n2. Retry the operation after ensuring connectivity.';
      solution += '\n3. If the problem persists, check GitHub service status at https://www.githubstatus.com.';
    } else {
      detailedMessage = error.message;
      solution += '\n1. Debug your server-side application for unexpected issues.';
    }

    res.json({
      status: false,
      message: detailedMessage,
      solution: solution
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
