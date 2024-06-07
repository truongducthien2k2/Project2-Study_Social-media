import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { BehaviorSubject, Subject } from 'rxjs';
import { User } from '../../interface';
import firebase from 'firebase/app'
import 'firebase/firestore'


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: Subject<any> = new BehaviorSubject<any>(null);

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {
    this.afAuth.authState.subscribe(async (user) => {
      if(user) {
        this.userData.next(user);
        await localStorage.setItem('user', JSON.stringify(user));
      } else {
        this.userData.next(null);
        await localStorage.removeItem('user');
      }
    })
  }

  async login(email: string, password: string): Promise<any> {
    await this.afAuth.signInWithEmailAndPassword(email, password);
    window.location.reload();
  }
  register(user: any): Promise<any> {
    return this.afAuth.createUserWithEmailAndPassword(user.email, user.password).then((res) => {
      this.setUserData(res.user, user.name, user.username)
    })
  }

  
  setUserData(user: any, name?: string, username?: string): Promise<any> {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: User = {
      uid: user.uid,
      email: user.email,
      displayName: name || '',
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
      username: username || '',
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    }

    return userRef.set(userData, {
      merge: true
    })
  }
  async getUserIdByEmail(email: string): Promise<string | null> {
    const usersRef = this.afs.collection('users', ref => ref.where('email', '==', email));
    const snapshot = await usersRef.get().toPromise();
    if (!snapshot.empty) {
      const userDoc = snapshot.docs[0];
      return userDoc.id;
    }
    return null;
  }
  async signOut(): Promise<void> {
    await this.afAuth.signOut().then(async (res) => {
      await localStorage.removeItem('user');
    })
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null;
  }

  get loggedInUserId(): string {
    const userData = localStorage.getItem('user');
    if (userData) {
      return JSON.parse(userData).uid;
    }
    return '';
  }
}
