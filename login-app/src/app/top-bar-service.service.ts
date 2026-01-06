
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

@Injectable({ providedIn: 'root' })
export class TopBarServiceService {

  constructor() { }

    private fromTopbarSource = new BehaviorSubject<boolean>(false);
  fromTopbar$ = this.fromTopbarSource.asObservable();

  setFromTopbar(value: boolean) {
    this.fromTopbarSource.next(value);
  }

    private customContentSource = new BehaviorSubject<boolean>(false);
  customContent$ = this.customContentSource.asObservable();


  setCustomContent(active: boolean) {
    this.customContentSource.next(active);
  }

    private viewUsersContentSource = new BehaviorSubject<boolean>(false);
  viewUsersList$ = this.viewUsersContentSource.asObservable();

   setViewUsersListContent(active: boolean) {
    this.viewUsersContentSource.next(active);
  }

   private ocrListContentSource = new BehaviorSubject<boolean>(false);
  ocrDocList$ = this.ocrListContentSource.asObservable();

   setOcrDocListContent(active: boolean) {
    this.ocrListContentSource.next(active);
  }

     private templateContentSource = new BehaviorSubject<boolean>(false);
  templateScreen$ = this.templateContentSource.asObservable();

   setTemplateContent(active: boolean) {
    this.templateContentSource.next(active);
  }
}

export class NavigationContextService {
  fromTopbar = false;
}
