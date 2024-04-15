export interface Issue {
  id: number;
  title: string;
  assignee: string | null;
  state: string;
}
