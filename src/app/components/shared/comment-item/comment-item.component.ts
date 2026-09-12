import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Comment } from '../../../interfaces/comment';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comment-item',
  imports: [DatePipe,FormsModule],
  templateUrl: './comment-item.component.html',
  styleUrl: './comment-item.component.scss',
})
export class CommentItemComponent {
  @Input() comment!: Comment;

  @Output() replyAdded = new EventEmitter<{
    commentId: number;
    content: string;
  }>();

  isReplying = false;
  replyText = '';

  toggleReply(): void {
    this.isReplying = !this.isReplying;

    if (!this.isReplying) {
      this.replyText = '';
    }
  }

  submitReply(): void {
    const content = this.replyText.trim();

    if (!content) {
      return;
    }

    this.replyAdded.emit({
      commentId: this.comment.id,
      content,
    });

    this.replyText = '';
    this.isReplying = false;
  }
}
