import {Inject, Injectable} from '@angular/core';
import {BehaviorSubject, catchError, concatAll, concatMap, EMPTY, Observable, scan, shareReplay} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Person} from "../interfaces/person.interface";

@Injectable()
export class ItemService<T = Person> {
  public currentItems$: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([0]);
  public items$: Observable<T[]>;
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

  public initItems(apiType: string): void {
    this.items$ = this.currentItems$.pipe(
      concatAll(),
      concatMap(index => this.getItem<T>(index, apiType)),
      scan((items: T[], current) => items.concat(current), []),
      shareReplay(1)
    );
  }
}

