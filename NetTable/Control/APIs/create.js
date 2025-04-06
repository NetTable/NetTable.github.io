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
      message: 'File name is required.'
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
    res.json({
      status: false,
      message: error.response?.data?.message || 'An error occurred.'
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
