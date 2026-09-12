import { Component, inject, OnInit } from '@angular/core';
import { Task } from '../../interfaces/task';
import { DatePipe } from '@angular/common';
import { TaskService } from '../../services/task/task.service';
import { ActivatedRoute } from '@angular/router';
import { CommentService } from '../../services/comment/comment.service';
import { Comment } from '../../interfaces/comment';
import { CommentItemComponent } from '../../components/shared/comment-item/comment-item.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-details',
  imports: [DatePipe,CommentItemComponent,FormsModule],
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss',
})
export class TaskDetailsComponent implements OnInit {
  comments: Comment[] = [];
  newComment = '';

  selectedTask: Task | null = null;

  constructor() {}

  private activatedRoute = inject(ActivatedRoute);
  private taskService = inject(TaskService);
  private commentService = inject(CommentService);

  taskId: number = Number(this.activatedRoute.snapshot.paramMap.get('id') || '');

  ngOnInit(): void {
    this.loadTaskDetails(this.taskId);
    this.loadComments();
  }

  loadTaskDetails(taskId: number): void {
    this.taskService.getTaskById(taskId).subscribe({
      next: (task) => {
        this.selectedTask = task || null;
        console.log(this.selectedTask);
      },
      error: (error) => {
        console.error('Failed to load task:', error);
        this.selectedTask = null;
      },
    });
  }

  loadComments(): void {
    this.comments = this.commentService.getCommentsByTaskId(this.taskId);
  }

  addComment(): void {
    const content = this.newComment.trim();

    if (!content) {
      return;
    }

    this.commentService.addComment(this.taskId, content);

    this.newComment = '';

    this.loadComments();
  }

  addReply(event: { commentId: number; content: string }): void {
    this.commentService.addReply(this.taskId, event.commentId, event.content);

    this.loadComments();
  }
}
