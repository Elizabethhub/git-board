const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/issues", async (req, res) => {
  try {
    const repoUrl = req.query.repoUrl;
    console.log("repoUrl", repoUrl);
    const urlWithoutProtocol = repoUrl.replace("https://github.com/", "");
    const trimmedUrl = urlWithoutProtocol.replace(/\/$/, "");
    const issuesUrl = `https://api.github.com/repos/${trimmedUrl}/issues`;
    const response = await axios.get(issuesUrl);
    // console.log("response", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching issues:", error.message);
    res.status(500).json({ error: "Failed to fetch issues" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
