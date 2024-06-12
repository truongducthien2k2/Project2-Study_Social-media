import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Report, User } from '../../interface';
import firebase from 'firebase/app'; // Sửa lỗi import
import 'firebase/firestore';
import { Observable, forkJoin } from 'rxjs';
import { UserService } from './user.service';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private afs: AngularFirestore, private userService: UserService) { }

  createReport(report: Report): Promise<void> {
    const id = this.afs.createId();
    report.id = id;
    report.createdAt = firebase.firestore.FieldValue.serverTimestamp();
    return this.afs.collection('reports').doc(id).set(report);
  }

  getAllReports(): Observable<Report[]> {
    return this.afs.collection<Report>('reports').valueChanges({ idField: 'id' });
  }

  markAsSeen(reportId: string): Promise<void> {
    return this.afs.collection('reports').doc(reportId).update({ seen: true });
  }

  createPostReport(postId: string, userIdFrom: string): Promise<void> {
    const report: Report = {
      id: this.afs.createId(),
      message: `report post`,
      userIdFrom: userIdFrom,
      target: postId,
      type: 'post',
      seen: false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };
    return this.createReport(report);
  }

  createUserReport(userId: string, userIdFrom: string, message: string): Promise<void> {
    const report: Report = {
      id: this.afs.createId(),
      message: message,
      userIdFrom: userIdFrom,
      target: userId,
      type: 'user',
      seen: false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };
    return this.createReport(report);
  }

  deleteReport(reportId: string): Promise<void> {
    return this.afs.collection('reports').doc(reportId).delete();
  }
}

