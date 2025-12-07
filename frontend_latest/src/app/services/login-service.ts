import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Login service provides logged in state
 */
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private isLoggedIn: boolean = false;
  private loginSource = new BehaviorSubject<boolean>(!!this.isLoggedIn);
  public readonly loggedIn = this.loginSource.asObservable();

  /**
   * Emits next Subject value
   * @param loggedIn
   */
  next(loggedIn: boolean): void {
    this.isLoggedIn = loggedIn;
    this.loginSource.next(loggedIn);
  }
}
