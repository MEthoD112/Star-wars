import {ChangeDetectionStrategy, Component} from '@angular/core';
import {InfiniteScrollConstants} from "../../contants/infinite-scroll.constants";

@Component({
  selector: 'app-infinite-scroll-container',
  templateUrl: './infinite-scroll-container.component.html',
  styleUrls: ['./infinite-scroll-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfiniteScrollContainerComponent {
  public infiniteScrollOptions = InfiniteScrollConstants;

}
