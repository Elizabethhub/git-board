import { create } from "zustand";
import { Issue } from "./types";

interface IssuesState {
  issues: {
    todo: Issue[];
    inProgress: Issue[];
    done: Issue[];
  };
  setIssues: (newIssues: Partial<IssuesState["issues"]>) => void;
}

export const useIssuesStore = create<IssuesState>((set) => ({
  issues: { todo: [], inProgress: [], done: [] },
  setIssues: (newIssues) =>
    set((state) => ({
      issues: {
        ...state.issues,
        ...newIssues,
      },
    })),
}));
