import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private documentIdSubject = new BehaviorSubject<number | null>(null); // Allow null
  private templateIdSubject = new BehaviorSubject<number | null>(null); // Allow null
  private headingIdSubject = new BehaviorSubject<number | null>(null);
  private templateNamesIdSubject = new BehaviorSubject<number | null>(null);
  setDocumentId(id: number) {
    this.documentIdSubject.next(id);
  }
  setHeadingId(id: number  | null) {
    this.headingIdSubject.next(id);
  }
  getDocumentId() {
    return this.documentIdSubject.asObservable();
  }
  getHeadingId() {
    return this.headingIdSubject.asObservable();
  }

  setTemplateNamesHeadingId(id: number  | null) {
    this.templateNamesIdSubject.next(id);
  }
  getTemplateNamesHeadingId() {
    return this.templateNamesIdSubject.asObservable();
  }



  setTemplateId(id: number) {
    this.templateIdSubject.next(id);
  }
  getTemplateId() {
    return this.templateIdSubject.asObservable();
  }


  private documentCreatedSource = new Subject<void>();
  private templateCreatedSource = new Subject<void>();

  // Observable to listen to the document creation event
  documentCreated$ = this.documentCreatedSource.asObservable();
  templateCreated$ = this.templateCreatedSource.asObservable();

  // Method to emit the event when a new document is created
  notifyDocumentCreated() {
   // alert("notify Document Created called!")
    this.documentCreatedSource.next();
  }

  notifyTemplateCreated() {
     this.templateCreatedSource.next();
   }


  private documentHeadingsUpdatedSource = new Subject<number>();
documentHeadingsUpdated$ = this.documentHeadingsUpdatedSource.asObservable();

private templateHeadingsUpdatedSource = new Subject<number>();
templateHeadingsUpdated$ = this.templateHeadingsUpdatedSource.asObservable();

// Method to emit the event when a document is updated
notifyHeadingsUpdated(documentId: number) {
  this.documentHeadingsUpdatedSource.next(documentId);
}

notifyTemplateHeadingsUpdated(templateId: number) {
  this.templateHeadingsUpdatedSource.next(templateId);
}



private documentSectionsSubject = new BehaviorSubject<any[]>([]);
getDocumentSections(): Observable<any[]> {
    return this.documentSectionsSubject.asObservable();
}
setDocumentSections(sections: any[]) {
    this.documentSectionsSubject.next(sections);
}

private templateSectionsSubject = new BehaviorSubject<any[]>([]);
getTemplateSections(): Observable<any[]> {
    return this.templateSectionsSubject.asObservable();
}
setTemplateSections(sections: any[]) {
    this.templateSectionsSubject.next(sections);
}

//document clearing triggering
private resetTriggered = false;
private projectsTriggered = false;

private settingToDocName = false;

triggerReset() {
  this.resetTriggered = true;
}

triggerProject() {
  this.projectsTriggered = true;
}

setProjectsOnNewPage(value: boolean) {
  this.projectsTriggered = value;
}
shouldSetProjectOnNewPage(): boolean {
  return this.projectsTriggered;
}


triggerDocTitle() {
  this.settingToDocName = true;
}

settingToDocNameTrigger(): boolean {
  const shouldBeTitle = this.resetTriggered;
  this.settingToDocName = false; // Reset the flag after checking
  return shouldBeTitle;
}

shouldReset(): boolean {
  const shouldReset = this.resetTriggered;
  this.resetTriggered = false; // Reset the flag after checking
  return shouldReset;
}

shouldSetProjectsOnNewPage(): boolean {
  const shouldTriggerProject = this.projectsTriggered;
  this.projectsTriggered = false; // Reset the flag after checking
  return shouldTriggerProject;
}

//selected option working for whole application
private selectedOption = new BehaviorSubject<string>('gpt');
private options = [
  { label: 'Open AI', value: 'openai', enabled: true },
  { label: 'Perplexity', value: 'perplexity', enabled: true },
];

setSelectedOption(option: string): void {
  this.selectedOption.next(option);
}

getSelectedOption():  Observable<string>  {
  return this.selectedOption.asObservable();
}

setDropdownOptions(options: any[]): void {
  this.options = options;
}

getDropdownOptions(): any[] {
  return this.options;
}



//DCMS working
private showOCRDocumentSubject = new BehaviorSubject<boolean>(false);
  showOCRDocument$ = this.showOCRDocumentSubject.asObservable();

  setShowOCRDocument(value: boolean) {
    this.showOCRDocumentSubject.next(value);
  }



  private resetDocumentSubject = new Subject<void>();

triggerResetFromTopbar() {
  this.resetDocumentSubject.next();
}

onResetTriggered(): Observable<void> {
  return this.resetDocumentSubject.asObservable();
}
}
