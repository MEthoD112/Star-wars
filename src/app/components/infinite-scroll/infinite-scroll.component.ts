import {ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, ViewChild} from '@angular/core';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  Subject,
  takeUntil,
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
export class InfiniteScrollComponent<T> implements OnDestroy {
  @ViewChild('scrollableContainer') public scrollableContainer: ElementRef;

  private destroy$ = new Subject();
  private _infiniteScrollOptions: InfiniteScrollOptions;

  @Input()
  public set infiniteScrollOptions(options: InfiniteScrollOptions) {
    this._infiniteScrollOptions = options;
    if (!this.itemService.items$) {
      this.itemService.initItems(options.apiType);
      const initialItems = Array.from({length: options.itemsOnInit}, (_, i) => i + 1);
      this.itemService.currentItems$.next(initialItems);
    }
  }

  public get infiniteScrollOptions(): InfiniteScrollOptions {
    return this._infiniteScrollOptions;
  }

  constructor(
    public itemService: ItemService,
    private router: Router,
  ) {
  }

  public ngOnDestroy(): void {
    this.destroy$.next('');
    this.destroy$.complete();
  }

  public ngAfterViewInit(): void {
    fromEvent<{ target: Element }>(this.scrollableContainer?.nativeElement, 'scroll').pipe(
      filter(({target}) => target.scrollHeight - target.scrollTop === target.clientHeight),
      debounceTime(100),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      const items = this.itemService.currentItems$.value.map((item, i, arr) => item + arr.length).slice(0, this.infiniteScrollOptions.itemsPerScroll);
      this.itemService.currentItems$.next(items);
    })
  }

  public goToDetailsPage(url: string): void {
    const array = url.split("/");
    const id = array[array.length - 2]
    void this.router.navigate([`${this.infiniteScrollOptions.apiType}/${id}`])
  }
}
