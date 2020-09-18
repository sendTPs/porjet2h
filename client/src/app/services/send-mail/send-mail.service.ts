import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { MailData } from '@models/mail-data.interface';

@Injectable({
  providedIn: 'root'
})
export class SendMailService {
  url: string;

  // this is the valid value of email get from exportation component to be send to the server by http method

  constructor(private httpClient: HttpClient) {
    this.url = 'http://localhost:3000/mail';
  }

  sendToServer(mailData: MailData): Observable<MailData> {
    return this.httpClient.post<MailData>(this.url, mailData);

  }

}
