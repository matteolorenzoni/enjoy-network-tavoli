import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CustomError } from '../models/type';
import { FirebaseCreateService } from './firebase/firebase-crud/firebase-create.service';

@Injectable({
  providedIn: 'root'
})
export class CustomErrorService {
  constructor(private firebaseCreateService: FirebaseCreateService) {}

  public async createCustomError(message: string, employeeUid: string): Promise<void> {
    const customError: CustomError = {
      uid: '',
      props: {
        message,
        from: employeeUid
      }
    };
    await this.firebaseCreateService.addDocument(environment.collection.ERRORS, customError);
  }
}
