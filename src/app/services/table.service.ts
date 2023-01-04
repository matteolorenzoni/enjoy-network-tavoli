import { Injectable } from '@angular/core';
import { QueryConstraint, where } from '@angular/fire/firestore';
import { Collection, TableDTO } from '../models/collection';
import { tableConverter } from '../models/converter';
import { Table } from '../models/type';
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
    const table: Table = await this.firebaseReadService.getDocumentByUid(Collection.TABLES, tableUid, tableConverter);
    return table;
  }

  public async getTableByEventUid(eventUid: string): Promise<Table[]> {
    const eventUidConstraint: QueryConstraint = where('eventUid', '==', eventUid);
    const constricts: QueryConstraint[] = [eventUidConstraint];
    const tables: Table[] = await this.firebaseReadService.getDocumentsByMultipleConstraints(
      Collection.TABLES,
      constricts,
      tableConverter
    );
    return tables;
  }

  public async getTableByEventUidAndEmployeeUid(eventUid: string, employeeUid: string): Promise<Table[]> {
    const eventUidConstraint: QueryConstraint = where('eventUid', '==', eventUid);
    const employeeUidConstraint: QueryConstraint = where('employeeUid', '==', employeeUid);
    const constricts: QueryConstraint[] = [eventUidConstraint, employeeUidConstraint];
    const tables: Table[] = await this.firebaseReadService.getDocumentsByMultipleConstraints(
      Collection.TABLES,
      constricts,
      tableConverter
    );
    return tables;
  }

  /* ------------------------------------------- ADD ------------------------------------------- */
  public async addOrUpdateTable(uid: string | null, props: TableDTO): Promise<void> {
    if (!uid) {
      /* Add new table */
      const table: Table = { uid: '', props };
      await this.firebaseCreateService.addTable(table);
    } else {
      /* Update document */
      const table: Table = { uid, props };
      await this.firebaseUpdateService.updateTable(table);
    }
  }

  /* ------------------------------------------- DELETE ------------------------------------------- */
  public async deleteTable(uid: string): Promise<void> {
    await this.firebaseDeleteService.deleteDocumentByUid(Collection.TABLES, uid);
  }
}
