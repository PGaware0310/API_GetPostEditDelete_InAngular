import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://jsonplaceholder.org/users';

  constructor(private http: HttpClient) { }

  // Get all users
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }
  // Add a new user
  addUser(user: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, user).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }
  // Update an existing user
  updateUser(user: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${user.id}`, user).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }
  // Delete a user
  deleteUser(userId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${userId}`).pipe(
      retry(3),
      catchError(this.handleError)
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError('Something went wrong; please try again later.');
  }
}
