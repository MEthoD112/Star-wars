import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {ItemService} from "../../services/item.service";
import {InfiniteScrollConstants} from "../../contants/infinite-scroll.constants";
import {Observable, Subject, takeUntil} from "rxjs";
import {Person} from "../../interfaces/person.interface";

@Component({
  selector: 'app-person-details',
  templateUrl: './person-details.component.html',
  styleUrls: ['./person-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonDetailsComponent implements OnInit, OnDestroy {
  public person$: Observable<Person>;
  public destroy$ = new Subject<void>();
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private itemService: ItemService
    ) { }

  public ngOnInit(): void {
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe((params: { id?: string}) => {
      const id = params.id as string;
      this.person$ = this.itemService.getItem(id, InfiniteScrollConstants.apiType);
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public goToList(): void {
    void this.router.navigate(['people']);
  }
}
