export interface Comment {
  id: number;
  taskId: number;
  author: string;
  content: string;
  createdAt: string;
  replies: Comment[];
}