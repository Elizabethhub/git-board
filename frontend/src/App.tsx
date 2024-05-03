import React, { useState, useEffect } from "react";
import axios from "axios";
import { IssuesState, useIssuesStore } from "./store";
import { Input, Button, Row, Col, List, Pagination } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { Issue } from "./types";
import styles from "./styles.module.css";

const App: React.FC = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const { issues, setIssues, pagination, setPagination } = useIssuesStore();
  // console.log("pagination", pagination);
  // const myPromise = new Promise((resolve, reject)= {

  // });
  const result = Math.pow(5, 1 / 5);
  console.log(result / 2);
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
      // setPagination({ currentPage: 1, pageSize: pagination.pageSize, totalItems: 0 });
      const todoIssues = data.filter((issue: Issue) => !issue.assignee && issue.state === "open");
      const inProgressIssues = data.filter((issue: Issue) => issue.assignee && issue.state === "open");
      const doneIssues = data.filter((issue: Issue) => issue.state === "closed");

      setIssues({ todo: todoIssues, inProgress: inProgressIssues, done: doneIssues });
    } catch (error) {
      console.error("Error loading issues:", error);
    }
  };
  const loadTotalIssueCount = async () => {
    const urlWithoutProtocol = repoUrl.replace("https://github.com/", "");
    const trimmedUrl = urlWithoutProtocol.replace(/\/$/, "");
    const issuesUrl = `https://api.github.com/search/issues?q="repo:${trimmedUrl}&state=all" --jq .total_count`;
    const response = await axios.get(issuesUrl);
    const { data } = response;
    setPagination({ totalItems: data.total_count });
  };
  const handleLoadIssues = () => {
    loadIssues(1, pagination.pageSize);
    loadTotalIssueCount();
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    const newPageSize = pageSize || pagination.pageSize;
    setPagination({ ...pagination, currentPage: page, pageSize: newPageSize });
    loadIssues(page, newPageSize);
  };

  const handlePageSizeChange = (current: number, size: number) => {
    const newTotalPages = Math.ceil(pagination.totalItems / size);
    const newCurrentPage = current > newTotalPages ? newTotalPages : current;
    setPagination({ ...pagination, currentPage: newCurrentPage, pageSize: size });
    loadIssues(newCurrentPage, size);
  };

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return; // No valid drop destination

    const sourceList = source.droppableId as keyof IssuesState["issues"];
    const destinationList = destination.droppableId as keyof IssuesState["issues"];

    const draggedItemId = result.draggableId;
    const draggedItem = issues[sourceList].find((item) => item.id.toString() === draggedItemId);
    if (!draggedItem) return;

    const updatedSourceList = issues[sourceList].filter((item) => item.id.toString() !== draggedItemId);
    const updatedDestinationList = [...issues[destinationList]];
    updatedDestinationList.splice(destination.index, 0, draggedItem);

    const updatedIssues: Partial<IssuesState["issues"]> = {
      ...issues,
      [sourceList]: updatedSourceList,
      [destinationList]: updatedDestinationList,
    };

    setIssues(updatedIssues);
  };
  // const handlecount = ()=> {

  // }
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <Row className={styles.inputRow} gutter={16} align="middle">
            <Col span={16}>
              <Input placeholder="Enter GitHub repo URL" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} />
            </Col>
            <Col>
              <Button type="primary" icon={<SearchOutlined />} onClick={handleLoadIssues}>
                Load
              </Button>
            </Col>
          </Row>

          <Row gutter={16}>
            {["todo", "inProgress", "done"].map((listKey) => (
              <Col key={listKey} className={styles.column} span={8}>
                <Droppable droppableId={listKey}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      <List
                        header={<h2 className={styles.columnHeader}>{capitalizeFirstLetter(listKey)}</h2>}
                        dataSource={issues[listKey as keyof typeof issues]}
                        renderItem={(item: Issue, index: number) => (
                          <Draggable key={item.id.toString()} draggableId={item.id.toString()} index={index}>
                            {(provided) => (
                              <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                <List.Item style={{ padding: "6px" }}>{item.title}</List.Item>
                              </div>
                            )}
                          </Draggable>
                        )}
                      />
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Col>
            ))}
          </Row>
        </div>
      </div>
      {pagination.totalItems > 0 && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Pagination
            current={pagination.currentPage}
            pageSize={pagination.pageSize}
            total={pagination.totalItems}
            onChange={handlePageChange}
            onShowSizeChange={handlePageSizeChange}
            showSizeChanger
          />
        </div>
      )}
    </DragDropContext>
  );
};
const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export default App;
