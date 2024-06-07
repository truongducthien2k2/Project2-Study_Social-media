import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Notification } from '../../interface';
import firebase from 'firebase/app'; // Sửa lỗi import
import 'firebase/firestore';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private afs: AngularFirestore) { }

  // Tạo thông báo mới
  createNotification(notification: Notification): Promise<void> {
    const id = this.afs.createId();
    notification.id = id;
    notification.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    return this.afs.collection('notifications').doc(id).set(notification);
  }

  getAllNotifications(): Observable<Notification[]> {
    return this.afs.collection<Notification>('notifications').valueChanges({ idField: 'id' });
  }
  

  markAsSeen(notificationId: string): Promise<void> {
    return this.afs.collection('notifications').doc(notificationId).update({ seen: true });
  }
   createLikeNotification(postId: string, userIdTo: string, userIdFrom: string): Promise<void> {
    const notification: Notification = {
      id: this.afs.createId(), 
      message: `Your post was liked by `,
      userIdTo: userIdTo,
      userIdFrom: userIdFrom,
      target: postId,
      type: 'like',
      seen: false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    return this.createNotification(notification);
  }
  deleteLikeNotification(postId: string, userIdTo: string, userIdFrom: string): Promise<void> {
    return this.afs.collection('notifications', ref =>
      ref
        .where('target', '==', postId)
        .where('userIdTo', '==', userIdTo)
        .where('userIdFrom', '==', userIdFrom)
        .where('type', '==', 'like')
    ).get().toPromise().then(querySnapshot => {
      const batch = this.afs.firestore.batch();
      querySnapshot.forEach(doc => {
        batch.delete(doc.ref);
      });
      return batch.commit();
    });
  }
}
