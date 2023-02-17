import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SMS, SMSResponse } from '../models/type';

@Injectable({
  providedIn: 'root'
})
export class SmsHostingService {
  constructor(private http: HttpClient) {}

  sendSms(to: string, text: string, params: { clientName: string; link: string }): Observable<SMSResponse> {
    const url = 'https://api.smshosting.it/rest/api/sms/send';

    /* Replace params */
    let messageClone = text;
    messageClone = messageClone.replace('{{CLIENT}}', params.clientName);
    messageClone = messageClone.replace('{{LINK}}', params.link);
    const sms: SMS = {
      to,
      text: messageClone,
      sandbox: true
    };

    /* Headers */
    const { username, password } = environment.smsHosting;
    const credentials = btoa(`${username}:${password}`);
    const httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Headers': '*',
        'Content-Type': 'application/json',
        Authorization: `Basic ${credentials}`
      })
    };

    return this.http.post<SMSResponse>(url, sms, httpOptions);
  }

  shortenURL(participationUid: string): Observable<{ ok: boolean; result: { full_short_link: string } }> {
    const { origin } = window.location;
    const urlToReduce = `${origin}/ticket?participation=${participationUid}`;
    const url = `https://api.shrtco.de/v2/shorten?url=${encodeURIComponent(urlToReduce)}`;
    return this.http.get<{ ok: boolean; result: { full_short_link: string } }>(url);
    // return of(urlToReduce);
  }
}
