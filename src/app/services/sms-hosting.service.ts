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

  sendSms(sms: SMS): Observable<SMSResponse> {
    const url = 'rest/api/sms/send';

    const { username, password } = environment.smsHosting;
    const credentials = btoa(`${username}:${password}`);

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Basic ${credentials}`
      })
    };

    return this.http.post<SMSResponse>(url, sms, httpOptions);
  }
}
