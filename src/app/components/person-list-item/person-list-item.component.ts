import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Person} from "../../interfaces/person.interface";

@Component({
  selector: 'app-person-list-item',
  templateUrl: './person-list-item.component.html',
  styleUrls: ['./person-list-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonListItemComponent<T extends Partial<Person>> {
  @Input() public person: T;
  @Input() public index = 0;
  @Output() public personClick = new EventEmitter<string>();

  public onPersonClick(): void {
    this.personClick.emit(this.person.url);
  }
}
