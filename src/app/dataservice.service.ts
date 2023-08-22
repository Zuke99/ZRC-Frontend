import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataserviceService {
  private apiUrl='http://13.126.46.248:8085/api/zrc'
  constructor(private http:HttpClient) { }

  fetchIntegers(searchTerm: string): Observable<{ ph_number: number, product_name: string }[]>{
    const url="http://13.126.46.248:8085/api/zrc/searchvalues"+"/"+searchTerm;
    //const params=new HttpParams().set('search',searchTerm);
    return this.http.get<{ ph_number: number, product_name: string }[]>(url);
  }

  fetchStrings(searchTerm : string):Observable<{ ph_number: number, product_name: string }[]>{
    const url="http://13.126.46.248:8085/api/zrc/searchvalues"+"/"+searchTerm;
   // const params=new HttpParams().set('search',searchTerm);
    return this.http.get<{ ph_number: number, product_name: string }[]>(url);
  }

  
  indentFetchIntegers(searchTerm: string): Observable<{ ph_number: number, product_name: string }[]>{
    const url="http://13.126.46.248:8085/api/zrc/indentsearchvalues"+"/"+searchTerm;
    //const params=new HttpParams().set('search',searchTerm);
    return this.http.get<{ ph_number: number, product_name: string }[]>(url);
  }

  indentFetchStrings(searchTerm : string):Observable<{ ph_number: number, product_name: string }[]>{
    const url="http://13.126.46.248:8085/api/zrc/indentsearchvalues"+"/"+searchTerm;
   // const params=new HttpParams().set('search',searchTerm);
    return this.http.get<{ ph_number: number, product_name: string }[]>(url);
  }

  fetchIntegersMaster(searchTerm: string): Observable<{ ph_number: number, product_name: string }[]>{
    const url="http://13.126.46.248:8085/api/zrc/master/searchvalues"+"/"+searchTerm;
    //const params=new HttpParams().set('search',searchTerm);
    return this.http.get<{ ph_number: number, product_name: string }[]>(url);
  }

  fetchStringsMaster(searchTerm : string):Observable<{ ph_number: number, product_name: string }[]>{
    const url="http://13.126.46.248:8085/api/zrc/master/searchvalues"+"/"+searchTerm;
   // const params=new HttpParams().set('search',searchTerm);
    return this.http.get<{ ph_number: number, product_name: string }[]>(url);
  }

  userIndentFetchIntegers(searchTerm: string, user_name : string, masterReq : boolean): Observable<{ ph_number: number, product_name: string }[]>{
    const url="http://13.126.46.248:8085/api/zrc/userindentsearchvalues"+"/"+searchTerm;
    //const params=new HttpParams().set('search',searchTerm);
    let bodyData={
      user_name: user_name,
      masterReq : masterReq
    }
    return this.http.post<{ ph_number: number, product_name: string }[]>(url,bodyData);
  }

  userIndentFetchStrings(searchTerm : string, user_name : string, masterReq : boolean):Observable<{ ph_number: number, product_name: string }[]>{
    let bodyData={
      user_name: user_name,
      masterReq:masterReq
    }
    const url="http://13.126.46.248:8085/api/zrc/userindentsearchvalues"+"/"+searchTerm;
   // const params=new HttpParams().set('search',searchTerm);
    return this.http.post<{ ph_number: number, product_name: string }[]>(url,bodyData);
  }




  uploadFileToRepo(file: File, filename: string, accessToken: string, owner: string, repo: string): Observable<any> {

    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filename}`;
    
    // Read the file content as base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    return new Observable((observer) => {
      reader.onloadend = () => {
        if(reader.result){
        const content = reader.result.toString().split(',')[1];
        const body = {
          message: `Upload ${filename}`,
          content: content
        };
      
        
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        });
        
        this.http.put(apiUrl, body, { headers: headers })
          .subscribe(
            (response) => {
              observer.next(response);
              observer.complete();
            },
            (error) => {
              observer.error(error);
            }
          );
      }else {
        observer.error('Failed to read file.');
      }
    };
    reader.onerror = (error) => {
      observer.error(error);
    };
    reader.readAsDataURL(file);
    });
  }
}
