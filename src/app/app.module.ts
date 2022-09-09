import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ItemService } from "./services/item.service";
import { CommonModule} from "@angular/common";
import { HttpClientModule} from "@angular/common/http";
import { PersonListItemComponent } from "./components/person-list-item/person-list-item.component";
import { InfiniteScrollComponent } from "./components/infinite-scroll/infinite-scroll.component";
import { environment } from "../environments/environment";
import { RouterModule } from "@angular/router";
import { PersonDetailsComponent } from './components/person-details/person-details.component';
import { routes } from "./app.routing";
import { InfiniteScrollContainerComponent } from './components/infinite-scroll-container/infinite-scroll-container.component';

@NgModule({
  declarations: [
    AppComponent,
    InfiniteScrollComponent,
    PersonListItemComponent,
    PersonDetailsComponent,
    InfiniteScrollContainerComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [
    ItemService,
    { provide: "BASE_API_URL", useValue: environment.apiUrl }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
