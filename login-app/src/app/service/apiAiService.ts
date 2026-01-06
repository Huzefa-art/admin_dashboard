import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError, timer } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class ApiAiService {

  private apiBaseUrlForAIDoc = environment.apiBaseUrlForAIDoc;
  private loginUser = this.apiBaseUrlForAIDoc + "django/user/token/";

  private automateSection = this.apiBaseUrlForAIDoc + "automate/sections/"
  private enhanceDoc = this.apiBaseUrlForAIDoc + "automate/enhance/doc"
  private automateTalk = this.apiBaseUrlForAIDoc + "automate/talk/"
  private automateFinalize = this.apiBaseUrlForAIDoc + "automate/finalize/doc"

  private automateSectionDCMS = this.apiBaseUrlForAIDoc + "AI_Doc_Features/Doc_Gen_AI/"

  private downloadPdfOCR = this.apiBaseUrlForAIDoc + "AI_Doc_Features/export-doc/"

  private documentStats = this.apiBaseUrlForAIDoc + "AI_Doc_Features/document-stats/"

  private completeDocument = this.apiBaseUrlForAIDoc + "document/complete/"
  private createDocumentPost = this.apiBaseUrlForAIDoc + "document/create/"
  // private documentsList = this.apiBaseUrlForAIDoc + "document/list/"
  private documentsList = this.apiBaseUrlForAIDoc + "ocr/list/"

  private deleteDocument = this.apiBaseUrlForAIDoc + "document/delete-complete/"
  //    private deleteTemplate = this.apiBaseUrlForAIDoc + "template/delete-template/"
  private deleteTemplate = this.apiBaseUrlForAIDoc + "AI_Doc_Features/templates/"


  private versionRevert = this.apiBaseUrlForAIDoc + "versions/revert/"
  private versionSaved = this.apiBaseUrlForAIDoc + "versions/saved/"
  private createVersion = this.apiBaseUrlForAIDoc + "versions/create/"

  private downloadPdf = this.apiBaseUrlForAIDoc + "/export"
  private downloadWord = this.apiBaseUrlForAIDoc + "/export/"





  private bulkSave = this.apiBaseUrlForAIDoc + "bulk/save/"
  private bulkNewSave = this.apiBaseUrlForAIDoc + "bulk/new-save/"
  private perplexity = this.apiBaseUrlForAIDoc + "template/upload-document-perplexity/"

  // private getProjects = this.apiBaseUrlForAIDoc + "/projects/projects/"
  private getProjects = this.apiBaseUrlForAIDoc + "AI_Doc_Features/projects/"
  //  private deleteProjectId = this.apiBaseUrlForAIDoc + "projects/projects/delete/"
  private deleteProjectId = this.apiBaseUrlForAIDoc + "AI_Doc_Features/projects/delete/"
  private documentPatchForProject = this.apiBaseUrlForAIDoc + "document/"
  private createProject = this.apiBaseUrlForAIDoc + "AI_Doc_Features/projects/create/"
  private editProject = this.apiBaseUrlForAIDoc + "AI_Doc_Features/projects/update/"
  //  private getDocumentsByProjectId = this.apiBaseUrlForAIDoc + "document/list_documents_by_project/"
  private getDocumentsByProjectId = this.apiBaseUrlForAIDoc + "AI_Doc_Features/list_documents_by_project/"


  private uploadDocumentOCR = this.apiBaseUrlForAIDoc + "ocr/upload/"
  private simpleDocumentOCR = this.apiBaseUrlForAIDoc + "ocr/documents/simple-upload/"
  private uploadDocumentAdvance = this.apiBaseUrlForAIDoc + "ocr/advance_ocr/"
  private bulkUploadDocOCR = this.apiBaseUrlForAIDoc + "ocr/api/documents/bulk-upload/"
  private getOCRDocumentLists = this.apiBaseUrlForAIDoc + "ocr/list/"
  private OCRDocumentDownload = this.apiBaseUrlForAIDoc + "ocr/download/"
  private deletingOCRDocument = this.apiBaseUrlForAIDoc + "ocr/document/delete/"
  private saveOCRDocument = this.apiBaseUrlForAIDoc + "ocr/documents/save-simple-doc/"
  private getDetailOFDocument = this.apiBaseUrlForAIDoc + "ocr/detail/"
  private saveDocumentFromContent = this.apiBaseUrlForAIDoc + "AI_Doc_Features/Save_doc/"
  private addAPIKey = this.apiBaseUrlForAIDoc + "AI_Doc_Features/add-api-key/"

  private enhanceContent = this.apiBaseUrlForAIDoc + "AI_Doc_Features/enhance_content/"


  private getAdminUser = this.apiBaseUrlForAIDoc + "user/admin/users/ "
  private getAdminUserAdmin = this.apiBaseUrlForAIDoc + "user/admin/user/ "
  private inviteUser = this.apiBaseUrlForAIDoc + "ocr/documents/permissions/grant/"
  private notifyEmail = this.apiBaseUrlForAIDoc + "ldap/send-email/"
  private addUserForOrganisation = this.apiBaseUrlForAIDoc + "user/admin/users/"
  private onlyAdminUsers = this.apiBaseUrlForAIDoc + "user/only-admin-users/"

  private updateUserRolePatch = this.apiBaseUrlForAIDoc + "user/admin/users/"
  private deleteUser = this.apiBaseUrlForAIDoc + "user/admin/users/"


  private autoRecords = this.apiBaseUrlForAIDoc + "org/all-records/"
  private postAutoRecords = this.apiBaseUrlForAIDoc + "org/generate-document/"
  private postPopluateTemplate = this.apiBaseUrlForAIDoc + "org/api/populate-template/"

  private postSelectApplicationWithoutAI = this.apiBaseUrlForAIDoc + "org/populate-template-withoutai/"
  private featuresPost = this.apiBaseUrlForAIDoc + "org/features/"
  private levelsPost = this.apiBaseUrlForAIDoc + "org/levels/"
  private departmentsPost = this.apiBaseUrlForAIDoc + "org/departments/"
  private functionsPost = this.apiBaseUrlForAIDoc + "org/api/functions/"
  private functionPatch = this.apiBaseUrlForAIDoc + "org/api/functions/"
  private functionDelete = this.apiBaseUrlForAIDoc + "org/api/functions/"
  private featureLevelAccess = this.apiBaseUrlForAIDoc + "org/level-feature-access/"
  private departmentLevelAccess = this.apiBaseUrlForAIDoc + "org/department-user-levels/"
  private deleteDepartmentLevelAccess = this.apiBaseUrlForAIDoc + "org/department-user-levels/"
  private getFeaturesLevelAcessList = this.apiBaseUrlForAIDoc + "org/level-feature-access/"
  private patchLevelFeatureAcess = this.apiBaseUrlForAIDoc + "org/level-feature-access/"
  private deleteLevelFeatureAcess = this.apiBaseUrlForAIDoc + "org/level-feature-access/"
  private getDepartmentLevelAcessList = this.apiBaseUrlForAIDoc + "org/department-user-levels/"
  private getFeaturesList = this.apiBaseUrlForAIDoc + "org/features/"
  private featureDelete = this.apiBaseUrlForAIDoc + "org/features/"
  private featurePatch = this.apiBaseUrlForAIDoc + "org/features/"
  private getLevelsList = this.apiBaseUrlForAIDoc + "org/levels/"
  private getDepartmentsList = this.apiBaseUrlForAIDoc + "org/departments/"
  private departmentPut = this.apiBaseUrlForAIDoc + "org/departments/"
  private departmentDelete = this.apiBaseUrlForAIDoc + "org/departments/"
  private getFunctionsList = this.apiBaseUrlForAIDoc + "org/api/functions/"
  private levelDelete = this.apiBaseUrlForAIDoc + "org/levels/"
   private levelPatch = this.apiBaseUrlForAIDoc + "org/levels/"
  private postForApproval = this.apiBaseUrlForAIDoc + "org/documents/"
  private mineApprovals = this.apiBaseUrlForAIDoc + "org/approvals/mine/"
  private approvalByTopLevel = this.apiBaseUrlForAIDoc + "org/approvals/"

  private favouriteDocuments = this.apiBaseUrlForAIDoc + "org/documents/favorites/"
  private favouriteRecentViewed = this.apiBaseUrlForAIDoc + "org/documents/recently-viewed/"
 private postViewDoc = this.apiBaseUrlForAIDoc + "org/documents/"
 private addToFav = this.apiBaseUrlForAIDoc + "org/documents/"

 private reportDownload = this.apiBaseUrlForAIDoc + "ocr/reports/document-activity/"
 private licenseDownload = this.apiBaseUrlForAIDoc + "org/api/license/generate/"

 private licenseFiles = this.apiBaseUrlForAIDoc + "org/upload-license/"

  private rfpGenerate = this.apiBaseUrlForAIDoc + "AI_Doc_Features/rfp_generate/"
  private exportRPF = this.apiBaseUrlForAIDoc + "AI_Doc_Features/rfp_export-chat-proposal/"

  constructor(private http: HttpClient) {
  }

  getDocumentList(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });

    return this.http.get<any>(this.documentsList, { headers: myHeaders });
  }

  uploadDocument(formData: FormData): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`,
    });

    return this.http.post<any>(
      `${this.apiBaseUrlForAIDoc}template/upload-document/`,
      formData,
      { headers }
    );
  }

  uploadDocumentPerplexity(formData: FormData): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`,
    });

    return this.http.post<any>(
      `${this.apiBaseUrlForAIDoc}template/upload-document-perplexity/`,
      formData,
      { headers }
    );
  }

  uploadTemplateForStructure(formData: FormData): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`,
    });

    return this.http.post(
      `${this.apiBaseUrlForAIDoc}AI_Doc_Features/Generate_templates`,
      formData,
      {
        headers,
        responseType: 'text'  // 👈 Important: treat response as plain text (HTML)
      }
    );
  }



  GetUserInfo(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`,
    });

    return this.http.get<any>(`${this.apiBaseUrlForAIDoc}user/me/`, { headers });
  }

  getTemplates(): Observable<any[]> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`,
    });
    return this.http.get<any[]>(`${this.apiBaseUrlForAIDoc}AI_Doc_Features/templates/`, { headers });
  }

  sendChatRequest(payload: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`, // Ensure the token is available
      'Content-Type': 'application/json',
    });

    return this.http.post<any>(`${this.apiBaseUrlForAIDoc}automate/enhance/doc`, payload, { headers });
  }


  insertPattern(payload: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`, // Ensure the token is available
      'Content-Type': 'application/json',
    });
    return this.http.post<any>(
      `${this.apiBaseUrlForAIDoc}AI_Doc_Features/templates/`,
      payload,
      { headers }
    );
  }

  submitAutomate(engine: any, prompt: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const requestedterms = JSON.stringify({
      "engine": engine,
      "prompt": prompt
    }, null, 2);

    // alert(requestedterms);

    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
    return this.http.post<any>(this.automateSectionDCMS, requestedterms, { headers: myHeaders })
  }

  enhanceAutomate(engine: any, prompt: any, document_id: any | null, history: any | null): Observable<any> {
    // const requestedterms = JSON.stringify({
    //   "engine": engine,
    //   "prompt": prompt,
    //   "document_id": document_id
    // }, null, 2);

    const requestPayload: any = {
      engine: engine,
      prompt: prompt,
    };

    // Add either document_id or history based on availability
    if (document_id) {
      requestPayload.document_id = document_id;
    } else if (history) {
      requestPayload.history = history;
    }

    // Convert payload to JSON
    const requestedTerms = JSON.stringify(requestPayload, null, 2);

    // alert(requestedTerms);
    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
    return this.http.post<any>(this.enhanceDoc, requestedTerms, { headers: myHeaders })
  }


  enhanceContentAPI(engine: any, prompt: any, context: any): Observable<any> {
    // const requestedterms = JSON.stringify({
    //   "engine": engine,
    //   "prompt": prompt,
    //   "document_id": document_id
    // }, null, 2);

    const requestPayload: any = {
      engine: engine,
      prompt: prompt,
      context: context
    };

    // Add either document_id or history based on availability
    // if (document_id) {
    //     requestPayload.document_id = document_id;
    // } else if (history) {
    //     requestPayload.history = history;
    // }

    // Convert payload to JSON
    const requestedTerms = JSON.stringify(requestPayload, null, 2);

    // alert(requestedTerms);
    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
    return this.http.post<any>(this.enhanceContent, requestedTerms, { headers: myHeaders })
  }

  talkAutomate(engine: any, prompt: any, history?: any[]): Observable<any> {
    const token = localStorage.getItem('authToken');
    const requestedterms = JSON.stringify({
      "engine": engine,
      "history": history,
      "prompt": prompt,
    }, null, 2);

    // alert(requestedterms);

    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
    return this.http.post<any>(this.automateTalk, requestedterms, { headers: myHeaders })
  }

  finalizeAutomate(engine: any, prompt: any, version_number: any, document_id: number): Observable<any> {
    const requestPayload: any = {
      engine: engine,
      prompt: prompt,
      document_id: document_id
    };
    // Add either document_id or history based on availability
    if (version_number) {
      requestPayload.version_id = version_number;
    }

    // Convert payload to JSON
    const requestedTerms = JSON.stringify(requestPayload, null, 2);

    // alert(requestedterms);
    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
    return this.http.post<any>(this.automateFinalize, requestedTerms, { headers: myHeaders })
  }


  createDocument(title: any): Observable<any> {
    const requestedterms = JSON.stringify({
      "title": title
    }, null, 2);

    // alert(requestedterms);
    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
    return this.http.post<any>(this.createDocumentPost, requestedterms, { headers: myHeaders })
  }

  getCompleteDocument(id: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
    const url = `${this.completeDocument}${id}/`;
    return this.http.get<any>(url, { headers: myHeaders });
  }


  selectTemplate(templateId: number, documentName: string): Observable<any> {

    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });

    const data = {
      template_id: templateId,
      document_name: documentName
    };

    return this.http.post<any>(`${this.apiBaseUrlForAIDoc}template/selected-template/`, data, { headers: myHeaders });
  }

  //   seeTemplate(templateId: number): Observable<any> {
  //     const myHeaders = new HttpHeaders({
  //         'Content-Type': 'application/json',
  //         'Authorization': `Token ${this.token}`
  //     });


  //     return this.http.get<any>(`${this.apiBaseUrlForAIDoc}template/see-template/${templateId}/`, { headers: myHeaders });
  // }
  seeTemplate(templateId: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });


    return this.http.get<any>(`${this.apiBaseUrlForAIDoc}AI_Doc_Features/templates/${templateId}/`, { headers: myHeaders });
  }

  // updateTemplate(templateId: number, payload: any): Observable<any> {
  //   const url = `${this.apiBaseUrlForAIDoc}template/update-template/${templateId}/`;
  //   const myHeaders = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Authorization': `Token ${this.token}`
  // });
  //   return this.http.put<any>(url, payload, { headers: myHeaders  });
  // }
  updateTemplate(templateId: number, payload: any): Observable<any> {
    const url = `${this.apiBaseUrlForAIDoc}AI_Doc_Features/templates/${templateId}/`;
    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
    return this.http.put<any>(url, payload, { headers: myHeaders });
  }


  getVersionRevert(documentID: number, versionID: any): Observable<any> {

    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
    const url = `${this.versionRevert}${documentID}/${versionID}/`;
    return this.http.get<any>(url, { headers: myHeaders });
  }


  getVersionSaved(documentID: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
    const url = `${this.versionSaved}${documentID}/`;
    return this.http.get<any>(url, { headers: myHeaders });
  }

  createVersions(document: number, version_number: any, message?: any) {
    const requestedterms = JSON.stringify({
      "document": document,
      "version_number": version_number,
    }, null, 2);

    // alert(requestedterms);

    const requestPayload: any = {
      document: document,
      version_number: version_number
    };
    // Add either document_id or history based on availability
    if (message) {
      requestPayload.message = message;
    }

    // Convert payload to JSON
    const requestedTerms = JSON.stringify(requestPayload, null, 2);

    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
    return this.http.post<any>(this.createVersion, requestedTerms, { headers: myHeaders })
  }

  saveBulk(document_id?: number, data: any = {}): Observable<any> {

    const requestData: any =
    {
      data

    };

    if (document_id !== undefined) {
      requestData.document_id = document_id;
    }

    // const requestedterms =
    // JSON.stringify({
    //   // "document_id":  document_id ?? null,
    //   "data": data || {}
    // }, null, 2);

    const requestedTerms = JSON.stringify(requestData, null, 2);

    // alert(requestedTerms);
    // console.log("saveBulk api",requestedTerms)
    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
    return this.http.post<any>(this.bulkSave, requestedTerms, { headers: myHeaders })
  }

  saveNewBulk(document_id?: number, data: any = {}): Observable<any> {

    const requestData: any =
    {
      data

    };

    if (document_id !== undefined) {
      requestData.document_id = document_id;
    }

    // const requestedterms =
    // JSON.stringify({
    //   // "document_id":  document_id ?? null,
    //   "data": data || {}
    // }, null, 2);

    const requestedTerms = JSON.stringify(requestData, null, 2);

    // alert(requestedTerms);
    // console.log("saveBulk api",requestedTerms)
    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
    return this.http.post<any>(this.bulkNewSave, requestedTerms, { headers: myHeaders })
  }




  deleteCompleteDocument(id: number): Observable<any> {
    const url = `${this.deleteDocument}${id}/`; // Ensure the URL ends with a trailing slash if required
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });

    return this.http.delete<any>(url, { headers });
  }

  deleteCompleteTemplate(id: number): Observable<any> {
    const url = `${this.deleteTemplate}${id}/`; // Ensure the URL ends with a trailing slash if required
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });

    return this.http.delete<any>(url, { headers });
  }

  getDocumentPdf(documentID: any, version_number?: any): Observable<Blob> {
    const requestPayload: any = {
      document_id: documentID,
    };
    if (version_number) {
      requestPayload.version_id = version_number;
    }
    const requestedTerms = JSON.stringify(requestPayload, null, 2);

    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
    // const url = `${this.downloadPdf}${documentID}/pdf/`;
    const url = `${this.downloadPdf}/pdf/`;
    return this.http.post<Blob>(url, requestedTerms, { headers: myHeaders, responseType: 'blob' as 'json' }); // Use 'blob' as response type
  }

  getDocumentWord(documentID: any, version_number?: any): Observable<any> {
    const requestPayload: any = {
      document_id: documentID,
    };
    if (version_number) {
      requestPayload.version_id = version_number;
    }
    const requestedTerms = JSON.stringify(requestPayload, null, 2);
    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
    //  const url = `${this.downloadWord}${documentID}/word/`;
    const url = `${this.downloadPdf}/word/`;
    return this.http.post<Blob>(url, requestedTerms, { headers: myHeaders, responseType: 'blob' as 'json' }); // Use 'blob' as response type
  }
  // #Project working
  getProjectsList(): Observable<any> {

    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });

    return this.http.get<any>(this.getProjects, { headers: myHeaders });
  }

  deleteProject(id: number): Observable<any> {
    const url = `${this.deleteProjectId}${id}/`; // Ensure the URL ends with a trailing slash if required
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`, // Replace this.token with the correct token variable
    });

    return this.http.delete<any>(url, { headers });
  }

  createProject_ProjectName(project_name?: any): Observable<any> {
    const requestedterms = JSON.stringify({
      "project_name": project_name
    }, null, 2);

    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
    return this.http.post<any>(this.createProject, requestedterms, { headers: myHeaders })
  }

  editProject_ProjectName(project_name?: any, project_id?: any): Observable<any> {

    const url = `${this.editProject}${project_id}/`;

    const requestedterms = JSON.stringify({
      "project_name": project_name
    }, null, 2);

    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
    return this.http.patch<any>(url, requestedterms, { headers: myHeaders })
  }


  patchDocumentSavedForProject(documentID: number, title: any, project_id: any): Observable<any> {

    const requestPayload: any = {
      title: title,
      project_id: project_id
    };

    // Convert payload to JSON
    const requestedTerms = JSON.stringify(requestPayload, null, 2);

    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });

    const url = `${this.documentPatchForProject}${documentID}/`;
    return this.http.patch<any>(url, requestedTerms, { headers: myHeaders });
  }

  getDocumentsByProjectID(projectid: any): Observable<any> {

    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
    const url = `${this.getDocumentsByProjectId}${projectid}/`;

    return this.http.get<any>(url, { headers: myHeaders });
  }

  //--------------

  //dcms api working


  //upload document for DCMS


  uploadDocumentUpload(payload: any): Observable<any> {
    const url = `http://127.0.0.1:8000/api/ocr/upload/`;
    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });


    const requestData: any =
    {
      title: payload.title,
      author: payload.author,
      tags: payload.tags,
      category: payload.category,
      file: payload.file
    };
    const requestedTerms = JSON.stringify(requestData, null, 2);

    console.log("payload of uploaded document", payload)
    console.log("payload of uploaded document through requested terms", requestedTerms)
    console.log("payload of uploaded document OCR Variable", this.uploadDocumentOCR)
    return this.http.post<any>(this.uploadDocumentOCR, payload, { headers: myHeaders });
  }

simpleDocumentUpload(payload: any): Observable<any> {
  const token = localStorage.getItem('authToken');
  const myHeaders = new HttpHeaders({
    'Authorization': `Token ${token}`
  });

  return this.http.post<any>(this.simpleDocumentOCR, payload, { headers: myHeaders });
}


  uploadDocumentOCRfromUploadDoc(payload: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`,
    });


    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('author', payload.author);
    formData.append('tags', payload.tags);
    formData.append('category', payload.category);

    if (payload.file) {
      formData.append('file', payload.file); // Ensure file is appended correctly
    }

    console.log("Payload before sending:", formData);
    console.log("Logging FormData:");
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });



    return this.http.post<any>(
      this.uploadDocumentOCR,
      payload,
      { headers }
    );
  }

  uploadDocumentOCRExactLayout(payload: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`,
    });


    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('author', payload.author);
    formData.append('tags', payload.tags);
    formData.append('category', payload.category);

    if (payload.file) {
      formData.append('file', payload.file); // Ensure file is appended correctly
    }

    console.log("Payload before sending:", formData);
    console.log("Logging FormData:");
    formData.forEach((value, key) => {
      console.log(`${key}:`, value);
    });



    return this.http.post<any>(
      this.uploadDocumentAdvance,
      payload,
      { headers }
    );
  }

  bulkUploadDocumentOCR(payload: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`,
    });

    return this.http.post<any>(
      this.bulkUploadDocOCR,
      payload,
      { headers }
    );
  }

  getOCRDocumentList(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });

    return this.http.get<any>(this.getOCRDocumentLists, { headers: myHeaders });
  }

  getDocumentDetail(docid: any): Observable<any> {
    const url = `${this.getDetailOFDocument}${docid}/`;
    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });

    return this.http.get<any>(url, { headers: myHeaders });
  }

  getDocumentDetailDummy(docid: any): Observable<any> {
    const url = `https://mpr900sw-8000.asse.devtunnels.ms/api/ocr/detail/1`;
    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token c6af14bf5503e04b585b76e4f14b6a72972f4cf2`
    });

    return this.http.get<any>(url, { headers: myHeaders });
  }

  saveDocument(document_id?: number, ocr_html?: any, title?: any, author?: any, category?: any, project?: any): Observable<any> {
    const requestPayload: any = {
      ocr_html: ocr_html,
      title: title,
    };
    if (author) {
      requestPayload.author = author;
    }
    if (category) {
      requestPayload.category = category;
    }
    if (project) {
      requestPayload.project = project;
    }
    const requestedterms = JSON.stringify(requestPayload, null, 2);

    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
    return this.http.post<any>(this.saveDocumentFromContent, requestedterms, { headers: myHeaders })
  }

  getOCRDocumentDownload(documentID: any): Observable<Blob> {
    const url = `${this.OCRDocumentDownload}${documentID}/`;
    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
    return this.http.get<Blob>(url, { headers: myHeaders, responseType: 'blob' as 'json' }); // Use 'blob' as response type
  }

  deleteOCRDocument(documentID: number): Observable<any> {
    const url = `${this.deletingOCRDocument}${documentID}/`; // Ensure the URL ends with a trailing slash if required
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });

    return this.http.delete<any>(url, { headers });
  }

  patchOCRDocument(documentOCRId: number, payload: any): Observable<any> {
    const url = `${this.apiBaseUrlForAIDoc}ocr/document/update/${documentOCRId}/`;
    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
    return this.http.patch<any>(url, payload, { headers: myHeaders });
  }

  getAdminUsers(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });

    return this.http.get<any>(this.getAdminUser, { headers: myHeaders });
  }

  getAdminUserSingle(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });

    return this.http.get<any>(this.getAdminUserAdmin, { headers: myHeaders });
  }
  getUsersOnDocument(documentOCRId: number): Observable<any> {
    const url = `${this.apiBaseUrlForAIDoc}ocr/documents/${documentOCRId}/users/`;
    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
    return this.http.get<any>(url, { headers: myHeaders });
  }

  inviteSomeone(document_id?: number, userid: any = {}): Observable<any> {
    const requestedterms = JSON.stringify({
      "document": document_id,
      "user": userid
    }, null, 2);

    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
    return this.http.post<any>(this.inviteUser, requestedterms, { headers: myHeaders })
  }

  addUserinOrganization(email?: any, password?: any, name?: any, role?: any): Observable<any> {
    const requestedterms = JSON.stringify({
      "email": email,
      "password": password,
      "name": name,
      "role": {
        "name": role
      }
    }, null, 2);

    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
    return this.http.post<any>(this.addUserForOrganisation, requestedterms, { headers: myHeaders })
  }


  updateUserRole(documentOCRId: number, payload: any): Observable<any> {
    const url = `${this.updateUserRolePatch}${documentOCRId}/`;
    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
    return this.http.patch<any>(url, payload, { headers: myHeaders });
  }

  versionNumbersMergingTracking(documentId: number): Observable<any> {
    const url = `${this.apiBaseUrlForAIDoc}Doc_Changes_Tracking_Merging/documents/${documentId}/versions/`;
    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
    return this.http.get<any>(url, { headers: myHeaders });
  }

  compareMergingTracking(documentId: number, versionId: number): Observable<any> {
    const url = `${this.apiBaseUrlForAIDoc}Doc_Changes_Tracking_Merging/documents/${documentId}/compare/${versionId}/`;
    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
    return this.http.get<any>(url, { headers: myHeaders });
  }

  MergingDocAndVersion(documentId: number, versionId: number): Observable<any> {
    const url = `${this.apiBaseUrlForAIDoc}Doc_Changes_Tracking_Merging/documents/${documentId}/merge/${versionId}/`;

    const requestedterms = JSON.stringify({
      "version_number": versionId
    }, null, 2);
    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
    return this.http.put<any>(url, requestedterms, { headers: myHeaders });
  }

  deletingUser(documentID: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const url = `${this.deleteUser}${documentID}/`; // Ensure the URL ends with a trailing slash if required
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`, // Replace this.token with the correct token variable
    });

    return this.http.delete<any>(url, { headers });
  }


  //pdf ocr
  DownloadOCRPdf(documentID: any, export_type?: any): Observable<Blob> {
    const requestPayload: any = {
      document_id: documentID,
    };
    if (export_type) {
      requestPayload.export_type = export_type;
    }
    const requestedTerms = JSON.stringify(requestPayload, null, 2);

    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
    // const url = `${this.downloadPdf}${documentID}/pdf/`;
    const url = `${this.downloadPdfOCR}`;
    return this.http.post<Blob>(url, requestedTerms, { headers: myHeaders, responseType: 'blob' as 'json' }); // Use 'blob' as response type
  }

  //stats of document
  StatisticsOfDocument(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
    return this.http.get<any>(this.documentStats, { headers: myHeaders });
  }


  //urgent requiremeent by Ali Nasir 2/2/2025

  getAutoRecords(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });

    return this.http.get<any>(this.autoRecords, { headers: myHeaders });
  }

  submitAllRecords(name: any, department: any, email: any, mobile_no: any, landline_no: any, address: any, prompt: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const requestedterms = JSON.stringify({
      "name": name,
      "department": department,
      "email": email,
      "mobile_no": mobile_no,
      "landline_no": landline_no,
      "address": address,
      "prompt": prompt

    }, null, 2);

    // alert(requestedterms);

    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
    return this.http.post<any>(this.postAutoRecords, requestedterms, { headers: myHeaders })
  }


  popluateTemplate(payload: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`, // Ensure the token is available
      'Content-Type': 'application/json',
    });

    return this.http.post<any>(`${this.postPopluateTemplate}`, payload, { headers });
  }

  popluateTemplateWithoutAI(payload: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`, // Ensure the token is available
      'Content-Type': 'application/json',
    });

    return this.http.post<any>(`${this.postSelectApplicationWithoutAI}`, payload, { headers });
  }

  addFeatures(payload: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`, // Ensure the token is available
      'Content-Type': 'application/json',
    });

    return this.http.post<any>(`${this.featuresPost}`, payload, { headers });
  }

  addLevel(payload: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`, // Ensure the token is available
      'Content-Type': 'application/json',
    });

    return this.http.post<any>(`${this.levelsPost}`, payload, { headers });
  }

  addDepartment(payload: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`, // Ensure the token is available
      'Content-Type': 'application/json',
    });

    return this.http.post<any>(`${this.departmentsPost}`, payload, { headers });
  }

  addFunctions(payload: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`, // Ensure the token is available
      'Content-Type': 'application/json',
    });

    return this.http.post<any>(`${this.functionsPost}`, payload, { headers });
  }

  getLevelFeatures(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });

    return this.http.get<any>(this.getFeaturesLevelAcessList, { headers: myHeaders });
  }

  levelFeatureAcessPatch(featureLevel: number, payload: any): Observable<any> {
    const url = `${this.patchLevelFeatureAcess}/${featureLevel}/`;
    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
    return this.http.patch<any>(url, payload, { headers: myHeaders });
  }

  getLevelDepartments(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });

    return this.http.get<any>(this.getDepartmentLevelAcessList, { headers: myHeaders });
  }

  addLevelFeatureAccess(payload: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`, // Ensure the token is available
      'Content-Type': 'application/json',
    });

    return this.http.post<any>(`${this.featureLevelAccess}`, payload, { headers });
  }

  addLevelDepartmentAccess(payload: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`, // Ensure the token is available
      'Content-Type': 'application/json',
    });

    return this.http.post<any>(`${this.departmentLevelAccess}`, payload, { headers });
  }


  getFeatures(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });

    return this.http.get<any>(this.getFeaturesList, { headers: myHeaders });
  }

  getLevels(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });

    return this.http.get<any>(this.getLevelsList, { headers: myHeaders });
  }

  getDepartments(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });

    return this.http.get<any>(this.getDepartmentsList, { headers: myHeaders });
  }

  getFunctions(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });

    return this.http.get<any>(this.getFunctionsList, { headers: myHeaders });
  }

  getFavouriteDocuments(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });

    return this.http.get<any>(this.favouriteDocuments, { headers: myHeaders });
  }

  getRecentlyViewed(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });

    return this.http.get<any>(this.favouriteRecentViewed, { headers: myHeaders });
  }

  savingOCRDocument(payload: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });


    const requestData: any = {};

    if (payload.title) requestData.title = payload.title;
    if (payload.author) requestData.author = payload.author;
    if (payload.tags) requestData.tags = payload.tags;
    if (payload.category) requestData.category = payload.category;
    if (payload.file) requestData.file = payload.file;
    if (payload.ocr_html) requestData.ocr_html = payload.ocr_html;
    if (payload.ocr_text) requestData.ocr_text = payload.ocr_text;
    if (payload.filename) requestData.filename = payload.filename;
    if (payload.project) requestData.project = payload.project;

    const requestedTerms = JSON.stringify(requestData, null, 2);

    return this.http.post<any>(this.saveOCRDocument, payload, { headers: myHeaders });
  }

  patchDepartmentAssignedUser(userid: number, payload: any): Observable<any> {
    const url = `${this.apiBaseUrlForAIDoc}org/department-user-levels/${userid}/`;
    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
    return this.http.patch<any>(url, payload, { headers: myHeaders });
  }

  deleteDepartmentAssignedUser(userid: number): Observable<any> {
    const url = `${this.deleteDepartmentLevelAccess}${userid}/`; // Ensure the URL ends with a trailing slash if required
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });

    return this.http.delete<any>(url, { headers });
  }

  deleteLevelFeatures(userid: number): Observable<any> {
    const url = `${this.deleteLevelFeatureAcess}${userid}/`; // Ensure the URL ends with a trailing slash if required
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });

    return this.http.delete<any>(url, { headers });
  }

      putFunction(featureid: number, payload: any): Observable<any> {
    const url = `${this.functionPatch}/${featureid}/`;
    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
    return this.http.put<any>(url, payload, { headers: myHeaders });
  }

  deleteFunction(function_id: number): Observable<any> {
    const url = `${this.functionDelete}${function_id}/`; // Ensure the URL ends with a trailing slash if required
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });

    return this.http.delete<any>(url, { headers });
  }

        putDepartment(deptd: number, payload: any): Observable<any> {
    const url = `${this.departmentPut}/${deptd}/`;
    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
    return this.http.put<any>(url, payload, { headers: myHeaders });
  }

  deleteDepartment(dept_id: number): Observable<any> {
    const url = `${this.departmentDelete}${dept_id}/`; // Ensure the URL ends with a trailing slash if required
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });

    return this.http.delete<any>(url, { headers });
  }


    patchLevel(userid: number, payload: any): Observable<any> {
    const url = `${this.levelPatch}/${userid}/`;
    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
    return this.http.patch<any>(url, payload, { headers: myHeaders });
  }


  deleteLevel(level_id: number): Observable<any> {
    const url = `${this.levelDelete}${level_id}/`; // Ensure the URL ends with a trailing slash if required
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });

    return this.http.delete<any>(url, { headers });
  }

      patchFeature(featureid: number, payload: any): Observable<any> {
    const url = `${this.featurePatch}/${featureid}/`;
    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
    return this.http.patch<any>(url, payload, { headers: myHeaders });
  }


  deleteFeature(feature_id: number): Observable<any> {
    const url = `${this.featureDelete}${feature_id}/`; // Ensure the URL ends with a trailing slash if required
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });

    return this.http.delete<any>(url, { headers });
  }
  sendForApproval(doc_id: number): Observable<any> {
    const url = `${this.postForApproval}${doc_id}/send-for-approval/`;
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });

    return this.http.post<any>(url, {}, { headers }); // <-- Corrected: empty body + headers
  }

  sendForApprovalHistory(doc_id: number): Observable<any> {
    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
    const url = `${this.postForApproval}${doc_id}/approval-history/`;
    return this.http.get<any>(url, { headers: myHeaders });
  }

  mineApprovalHistory(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });

    return this.http.get<any>(this.mineApprovals, { headers: myHeaders });
  }

  approval(payload: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
    const requestData: any = {};
    if (payload.comment) requestData.comment = payload.comment;
    if (payload.action) requestData.action = payload.action;
    const requestedTerms = JSON.stringify(requestData, null, 2);
    const url = `${this.approvalByTopLevel}${payload.id}/action/`;
    return this.http.post<any>(url, requestedTerms, { headers: myHeaders });
  }

  changePassword(password: string): Observable<any> {
    const url = `${this.apiBaseUrlForAIDoc}user/me/`;

    const body = {

      password: password
    };

    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });

    return this.http.patch<any>(url, body, { headers });
  }

  activeDeactive(verified: any): Observable<any> {
    const url = `${this.apiBaseUrlForAIDoc}user/me/`;

    const body = {

      verified: verified
    };

    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });

    return this.http.patch<any>(url, body, { headers });
  }
  forgetPassword(email: string): Observable<any> {
    const url = `${this.apiBaseUrlForAIDoc}/user/auth/forgot-password/`;

    const body = { email };

    const token = localStorage.getItem('authToken');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}` // optional if not required for forgot password
    });

    return this.http.post<any>(url, body, { headers });
  }
  resetPassword(email: string, password: string, resetToken: string): Observable<any> {
    const url = `${this.apiBaseUrlForAIDoc}/user/auth/reset-password/`;

    const body = {
      email: email,
      password: password,
      reset_token: resetToken
    };

    const token = localStorage.getItem('authToken');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}` // optional if not required for forgot password
    });

    return this.http.post<any>(url, body, { headers });
  }
  verifyOTP(email: string, otp: string): Observable<any> {
    const url = `${this.apiBaseUrlForAIDoc}/user/auth/verify-otp/`;

    const body = {
      email: email,
      otp: otp
    };

    const token = localStorage.getItem('authToken');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}` // optional if not required for forgot password
    });

    return this.http.post<any>(url, body, { headers });
  }


    geUsersAdmin(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });

    return this.http.get<any>(this.onlyAdminUsers, { headers: myHeaders });
  }


    postRecentViewDoc(doc_id: number): Observable<any> {
    const url = `${this.postViewDoc}${doc_id}/view/`;
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });

    return this.http.post<any>(url, {}, { headers }); // <-- Corrected: empty body + headers
  }

    addToFavourite(doc_id: number): Observable<any> {
    const url = `${this.addToFav}${doc_id}/favorite-toggle/`;
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });

    return this.http.post<any>(url, {}, { headers }); // <-- Corrected: empty body + headers
  }


  commentPost(commentText: string, selectedText: string,document_id:any,userid?:any): Observable<any> {
    const url = `${this.apiBaseUrlForAIDoc}ocr/documents/${document_id}/comments/create/`;

    const body = {
      document:document_id,
      comment: commentText,
      selected_text: selectedText,
      user: userid
    };

    const token = localStorage.getItem('authToken');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}` // optional if not required for forgot password
    });

    return this.http.post<any>(url, body, { headers });
  }

  editComment(selected_text?: any,comment?:any, document_id?: any): Observable<any> {

        const url = `${this.apiBaseUrlForAIDoc}ocr/comments/${document_id}/edit/`;

    const requestedterms = JSON.stringify({
      "selected_text": selected_text,
      "comment": comment
    }, null, 2);

    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
    return this.http.patch<any>(url, requestedterms, { headers: myHeaders })
  }

    deleteComment(id: number): Observable<any> {
         const url = `${this.apiBaseUrlForAIDoc}ocr/comments/${id}/delete/`;
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });

    return this.http.delete<any>(url, { headers });
  }

downloadReport(): Observable<Blob> {
  const token = localStorage.getItem('authToken');
  const myHeaders = new HttpHeaders({
    'Authorization': `Token ${token}`
  });

  return this.http.get(this.reportDownload, {
    headers: myHeaders,
    responseType: 'blob'  // 🔑 Tells Angular we expect a binary file
  });
}


  sendEmailNotify(from_email: any, to_email: any, subject: any, messageOrDocumentTitle: any, user_email?: any, document_link?: any): Observable<any> {
    const payload: any = {
      from_email: from_email,
      to_email: to_email,
      subject: subject
    };

    if (user_email !== undefined) {
      payload.document_title = messageOrDocumentTitle;
      payload.user_email = user_email;
      payload.document_link = document_link;
      payload.message = 'null';
    } else {
      payload.message = messageOrDocumentTitle;
    }

    const requestedterms = JSON.stringify(payload, null, 2);

    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
    return this.http.post<any>(this.notifyEmail, requestedterms, { headers: myHeaders })
  }

licenseKeyDownload(vm_id: string, expiry: string) {
  const requestedTerms = JSON.stringify({
    vm_id: vm_id,
    expiry: expiry
  }, null, 2);

  const token = localStorage.getItem('authToken');
  const myHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Token ${token}`
  });

  return this.http.post(this.licenseDownload, requestedTerms, {
    headers: myHeaders,
    responseType: 'blob' // 👈 this ensures we get a downloadable file
  });
}

//   licenseKeyDownload(vm_id: string, expiry: string) {
//   return this.http.post(
//     this.licenseDownload,
//     { vm_id, expiry },
//     { responseType: 'blob' } // 👈 important!
//   );
// }


  uploadLicenseFiles(formData: FormData): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`,
    });

    return this.http.post<any>(
      `${this.apiBaseUrlForAIDoc}org/upload-license/`,
      // 'http://127.0.0.1:8000/api/org/upload-license/',
      formData,
      { headers }
    );
  }


  //   generateRFP(engine: any, prompt: any, document:any,document_id: any | null, history: any | null): Observable<any> {
  //   // const requestedterms = JSON.stringify({
  //   //   "engine": engine,
  //   //   "prompt": prompt,
  //   //   "document_id": document_id
  //   // }, null, 2);

  //   const urlDemo = "https://mpr900sw-8000.asse.devtunnels.ms/api/AI_Doc_Features/rfp_generate/"
  //   const requestPayload: any = {
  //     engine: engine,
  //     prompt: prompt,
  //     document:document
  //   };

  //   // Add either document_id or history based on availability
  //   if (document_id) {
  //     requestPayload.document_id = document_id;
  //   } else if (history) {
  //     requestPayload.history = history;
  //   }

  //   // Convert payload to JSON
  //   const requestedTerms = JSON.stringify(requestPayload, null, 2);

  //   // alert(requestedTerms);
  //   const token = localStorage.getItem('authToken');
  //   const myHeaders = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Authorization': `Token ${token}`
  //   });
  //   return this.http.post<any>(urlDemo, requestedTerms, { headers: myHeaders })
  // }


    generateRFP(formData: FormData): Observable<any> {
       const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`,
    });


      const urlDemo = "https://mpr900sw-8000.asse.devtunnels.ms/api/AI_Doc_Features/rfp_generate/"


       return this.http.post<any>(
      this.rfpGenerate,
      // 'http://127.0.0.1:8000/api/org/upload-license/',
      formData,
      { headers }
    );
  }

exportRFPFile(chat_history: string, export_type: string) {
  const requestedTerms = JSON.stringify({
    chat_history: chat_history,
    export_type: export_type
  }, null, 2);

  const token = localStorage.getItem('authToken');
  const myHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Token ${token}`
  });

  return this.http.post(this.exportRPF, requestedTerms, {
    headers: myHeaders,
    responseType: 'blob'
  });
}


}

