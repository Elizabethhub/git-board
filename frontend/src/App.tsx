import React, { useState } from "react";
import axios from "axios";
import { useIssuesStore } from "./store";
import { Input, Button, Row, Col, List } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Issue } from "./types";
import styles from "./styles.module.css";

const App: React.FC = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const { issues, setIssues } = useIssuesStore();

  const loadIssues = async (offset: number, limit: number) => {
    try {
      // const apiUrl = `http://localhost:3000/api/issues?repoUrl=${encodeURIComponent(repoUrl)}`;
      const urlWithoutProtocol = repoUrl.replace("https://github.com/", "");
      const trimmedUrl = urlWithoutProtocol.replace(/\/$/, "");
      const issuesUrl = `https://api.github.com/repos/${trimmedUrl}/issues?per_page=${limit}&page=${offset}&state=all`;
      const response = await axios.get(issuesUrl);

      const { data } = response;
      console.log("data", data);
      if (!Array.isArray(data)) {
        console.error("Invalid data received from API:", data);
        return;
      }
      const todoIssues = data.filter((issue: Issue) => !issue.assignee && issue.state === "open");
      const inProgressIssues = data.filter((issue: Issue) => issue.assignee && issue.state === "open");
      const doneIssues = data.filter((issue: Issue) => issue.state === "closed");

      setIssues({ todo: todoIssues, inProgress: inProgressIssues, done: doneIssues });
    } catch (error) {
      console.error("Error loading issues:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <Row className={styles.inputRow} gutter={16} align="middle">
          <Col span={16}>
            <Input placeholder="Enter GitHub repo URL" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} />
          </Col>
          <Col>
            <Button type="primary" icon={<SearchOutlined />} onClick={() => loadIssues(1, 100)}>
              Load
            </Button>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <List
              header={<h2 className={styles.columnHeader}>ToDo</h2>}
              dataSource={issues.todo}
              renderItem={(item: Issue) => <List.Item>{item.title}</List.Item>}
            />
          </Col>
          <Col span={8}>
            <List
              header={<h2 className={styles.columnHeader}>In Progress</h2>}
              dataSource={issues.inProgress}
              renderItem={(item: Issue) => <List.Item>{item.title}</List.Item>}
            />
          </Col>
          <Col span={8}>
            <List
              header={<h2 className={styles.columnHeader}>Done</h2>}
              dataSource={issues.done}
              renderItem={(item: Issue) => <List.Item>{item.title}</List.Item>}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default App;
