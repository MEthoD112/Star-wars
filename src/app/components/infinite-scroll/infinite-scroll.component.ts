import {ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {
  BehaviorSubject,
  concatAll,
  concatMap,
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  of,
  scan,
  tap
} from "rxjs";
import {ItemService} from "../../services/item.service";
import {InfiniteScrollOptions} from "../../interfaces/infinite-scroll-options.interface";
import {Router} from "@angular/router";

@Component({
  selector: 'app-infinite-scroll',
  templateUrl: './infinite-scroll.component.html',
  styleUrls: ['./infinite-scroll.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfiniteScrollComponent<T> implements OnInit {
  @ViewChild('scrollableContainer') public scrollableContainer: ElementRef;

  private currentItems$: BehaviorSubject<number[]>;
  private _infiniteScrollOptions: InfiniteScrollOptions;

  @Input() public set infiniteScrollOptions(options: InfiniteScrollOptions) {
    this._infiniteScrollOptions = options;
    const initialItems = Array.from({length: options.itemsOnInit}, (_, i) => i + 1);
    this.currentItems$ = new BehaviorSubject<number[]>(initialItems);
  }

  public get infiniteScrollOptions(): InfiniteScrollOptions {
    return this._infiniteScrollOptions;
  }

  public items$ = of<T[]>([]);
  public scroll$ = of<number>(0);

  constructor(
    private itemService: ItemService,
    private router: Router,
    ) {}

  public ngOnInit(): void {
    this.items$ = this.currentItems$.pipe(
      concatAll(),
      concatMap(index => this.itemService.getItem<T>(index, this.infiniteScrollOptions.apiType)),
      scan((items: T[], current) => items.concat(current), [])
    );
  }

  public ngAfterViewInit(): void {
    this.scroll$ = fromEvent<{ target: Element }>(this.scrollableContainer?.nativeElement, 'scroll').pipe(
      filter(({target}) => target.scrollHeight - target.scrollTop === target.clientHeight),
      debounceTime(100),
      distinctUntilChanged(),
      map((_, index) => index),
      tap(() => {
        const items = this.currentItems$.value.map((item, i, arr) => item + arr.length).
          slice(0, this.infiniteScrollOptions.itemsPerScroll);
        this.currentItems$.next(items);
      })
    )
  }

  public goToDetailsPage(item: T & {url?: string}): void {
    const array = (item.url as string).split("/");
    const id = array[array.length - 2]
    void this.router.navigate([`${this.infiniteScrollOptions.apiType}/${id}`])
  }
}
