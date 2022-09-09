import {Inject, Injectable} from '@angular/core';
import {catchError, EMPTY, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable()
export class ItemService {
  constructor(
    @Inject('BASE_API_URL') private baseUrl: string,
    private http: HttpClient
  ) {}

  public getItem<T>(id: number | string, type: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${type}/${id}`)
      .pipe(
        catchError(() => EMPTY)
    )
  }
}

