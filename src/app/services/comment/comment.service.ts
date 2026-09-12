import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Comment } from '../../interfaces/comment';

@Injectable({
  providedIn: 'root',
})

export class CommentService {
  private commentsSubject = new BehaviorSubject<Comment[]>([]);

  comments$ = this.commentsSubject.asObservable();

  private comments: Comment[] = this.commentsSubject.value;

  getCommentsByTaskId(taskId: number): Comment[] {
    return this.comments.filter((comment) => comment.taskId === taskId);
  }

  addComment(taskId: number, content: string): void {
    const newComment: Comment = {
      id: this.generateId(),
      taskId,
      author: 'You',
      content,
      createdAt: new Date().toISOString(),
      replies: [],
    };

    this.comments = [...this.comments, newComment];

    this.commentsSubject.next(this.comments);
  }

  addReply(taskId: number, parentCommentId: number, content: string): void {
    const updatedComments = this.comments.map((comment) => {
      if (comment.taskId !== taskId) {
        return comment;
      }

      return this.addReplyRecursive(comment, parentCommentId, content);
    });

    this.comments = updatedComments;

    this.commentsSubject.next(this.comments);
  }

  private addReplyRecursive(
    comment: Comment,
    parentCommentId: number,
    content: string,
  ): Comment {
    if (comment.id === parentCommentId) {
      return {
        ...comment,
        replies: [
          ...comment.replies,
          {
            id: this.generateId(),
            taskId: comment.taskId,
            author: 'You',
            content,
            createdAt: new Date().toISOString(),
            replies: [],
          },
        ],
      };
    }

    return {
      ...comment,
      replies: comment.replies.map((reply) =>
        this.addReplyRecursive(reply, parentCommentId, content),
      ),
    };
  }

  private generateId(): number {
    return Date.now() + Math.floor(Math.random() * 1000);
  }
}
