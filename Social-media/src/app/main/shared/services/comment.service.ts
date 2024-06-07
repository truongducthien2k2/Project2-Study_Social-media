import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Comment, Post, User } from '../../interface';
import { Observable, combineLatest } from 'rxjs';
import { defaultIfEmpty, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(private afs: AngularFirestore) {}

  updateComment(commentId: string, data: Partial<Comment>): Promise<void> {
    return this.afs.collection<Comment>('comments').doc(commentId).update(data);
  }

}
