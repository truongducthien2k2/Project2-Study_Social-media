import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';

export interface AuthStrategy {
  login(email: string, password: string): Observable<any>;
}

@Injectable({
  providedIn: 'root'
})
export class EmailPasswordAuthStrategy implements AuthStrategy {
  constructor(private afAuth: AngularFireAuth) {}

  login(email: string, password: string): Observable<any> {
    return from(this.afAuth.signInWithEmailAndPassword(email, password));
  }
}

@Injectable({
  providedIn: 'root'
})
export class StrategyService {
  private strategy: AuthStrategy;

  constructor(private emailPasswordAuthStrategy: EmailPasswordAuthStrategy) {
    this.strategy = this.emailPasswordAuthStrategy; 
  }

  setStrategy(strategy: AuthStrategy) {
    this.strategy = strategy;
  }

  login(email: string, password: string): Observable<any> {
    return this.strategy.login(email, password);
  }
}
