import { create } from "zustand";
import { Issue } from "./types";

export interface IssuesState {
  issues: {
    todo: Issue[];
    inProgress: Issue[];
    done: Issue[];
  };
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
  };
  setIssues: (newIssues: Partial<IssuesState["issues"]>) => void;
  setPagination: (newPagination: Partial<IssuesState["pagination"]>) => void;
}

export const useIssuesStore = create<IssuesState>((set) => ({
  issues: { todo: [], inProgress: [], done: [] },
  pagination: {
    currentPage: 1,
    pageSize: 50, // Initial page size (number of items per page)
    totalItems: 0,
  },
  setIssues: (newIssues) =>
    set((state) => ({
      issues: {
        ...state.issues,
        ...newIssues,
      },
    })),
  setPagination: (newPagination) =>
    set((state) => ({
      pagination: {
        ...state.pagination,
        ...newPagination,
      },
    })),
}));
