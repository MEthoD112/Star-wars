import {
  InfiniteScrollContainerComponent
} from "./components/infinite-scroll-container/infinite-scroll-container.component";
import {PersonDetailsComponent} from "./components/person-details/person-details.component";

export const routes = [
  {
    path: '',
    redirectTo: '/people',
    pathMatch: 'full'
  },
  {
    path: 'people',
    component: InfiniteScrollContainerComponent
  },
  {
    path: 'people/:id',
    component: PersonDetailsComponent
  },
]
