import { Injectable } from '@angular/core';
import { QueryConstraint, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { participationConverter, tableConverter } from '../models/converter';
import { Participation, Table } from '../models/type';
import { FirebaseCreateService } from './firebase/firebase-crud/firebase-create.service';
import { FirebaseDeleteService } from './firebase/firebase-crud/firebase-delete.service';
import { FirebaseReadService } from './firebase/firebase-crud/firebase-read.service';
import { FirebaseUpdateService } from './firebase/firebase-crud/firebase-update.service';

@Injectable({
  providedIn: 'root'
})
export class TableService {
  constructor(
    private firebaseCreateService: FirebaseCreateService,
    private firebaseReadService: FirebaseReadService,
    private firebaseUpdateService: FirebaseUpdateService,
    private firebaseDeleteService: FirebaseDeleteService
  ) {}

  /* ------------------------------------------- GET ------------------------------------------- */
  public async getTable(tableUid: string): Promise<Table> {
    const table: Table = await this.firebaseReadService.getDocumentByUid(
      environment.collection.TABLES,
      tableUid,
      tableConverter
    );
    return table;
  }

  public async getTableByEventUid(eventUid: string): Promise<Table[]> {
    const eventUidConstraint: QueryConstraint = where('eventUid', '==', eventUid);
    const isActiveConstraint: QueryConstraint = where('isActive', '==', true);
    const constricts: QueryConstraint[] = [eventUidConstraint, isActiveConstraint];

    const tables: Table[] = await this.firebaseReadService.getDocumentsByMultipleConstraints(
      environment.collection.TABLES,
      constricts,
      tableConverter
    );
    return tables;
  }

  public async getTableByEventUidAndEmployeeUid(eventUid: string, employeeUid: string): Promise<Table[]> {
    const eventUidConstraint: QueryConstraint = where('eventUid', '==', eventUid);
    const employeeUidConstraint: QueryConstraint = where('employeeUid', '==', employeeUid);
    const isActiveConstraint: QueryConstraint = where('isActive', '==', true);
    const constricts: QueryConstraint[] = [eventUidConstraint, employeeUidConstraint, isActiveConstraint];

    const tables: Table[] = await this.firebaseReadService.getDocumentsByMultipleConstraints(
      environment.collection.TABLES,
      constricts,
      tableConverter
    );
    return tables;
  }

  public getRealTimeTableByEventUid(eventUid: string): Observable<Table[]> {
    const eventUidConstraint: QueryConstraint = where('eventUid', '==', eventUid);
    const isActiveConstraint: QueryConstraint = where('isActive', '==', true);
    const constraints: QueryConstraint[] = [eventUidConstraint, isActiveConstraint];

    const tables: Observable<Table[]> = this.firebaseReadService.getRealTimeDocumentsByMultipleConstraints(
      environment.collection.TABLES,
      constraints,
      tableConverter
    );
    return tables;
  }

  public getRealTimeTableByEventUidAndEmployeeUid(eventUid: string, employeeUid: string): Observable<Table[]> {
    const eventUidConstraint: QueryConstraint = where('eventUid', '==', eventUid);
    const employeeUidConstraint: QueryConstraint = where('employeeUid', '==', employeeUid);
    const isActiveConstraint: QueryConstraint = where('isActive', '==', true);
    const constraints: QueryConstraint[] = [eventUidConstraint, employeeUidConstraint, isActiveConstraint];

    const tables: Observable<Table[]> = this.firebaseReadService.getRealTimeDocumentsByMultipleConstraints(
      environment.collection.TABLES,
      constraints,
      tableConverter
    );
    return tables;
  }

  /* ------------------------------------------- ADD ------------------------------------------- */
  public async addOrUpdateTable(table: Table): Promise<void> {
    if (!table.uid) {
      const eventNameConstraint: QueryConstraint = where('name', '==', table.props.name);
      const constraints: QueryConstraint[] = [eventNameConstraint];
      const tables: Table[] = await this.firebaseReadService.getDocumentsByMultipleConstraints(
        environment.collection.TABLES,
        constraints,
        tableConverter
      );

      if (tables.length > 0) {
        throw new Error('Nome del tavolo già utilizzato');
      }

      /* Add new table */
      await this.firebaseCreateService.addDocument(environment.collection.TABLES, table);
    } else {
      /* Update document */
      await this.firebaseUpdateService.updateDocument(environment.collection.TABLES, table);
    }
  }

  /* ------------------------------------------- DELETE ------------------------------------------- */
  public async deleteTable(tableUid: string): Promise<void> {
    /* Make participations inactive */
    const tableUidConstraint = where('tableUid', '==', tableUid);
    const constricts: QueryConstraint[] = [tableUidConstraint];
    const participations: Participation[] = await this.firebaseReadService.getDocumentsByMultipleConstraints(
      environment.collection.PARTICIPATIONS,
      constricts,
      participationConverter
    );

    /* Delete table */
    if (participations.length === 0) {
      await this.firebaseDeleteService.deleteDocumentByUid(environment.collection.TABLES, tableUid);
      return;
    }

    /* Make table and participations inactive */
    const propsToUpdate = { isActive: false };

    await this.firebaseUpdateService.updateDocumentProps(environment.collection.TABLES, tableUid, propsToUpdate);

    await this.firebaseUpdateService.updateDocumentsProps(
      environment.collection.PARTICIPATIONS,
      participations,
      propsToUpdate
    );
  }
}
