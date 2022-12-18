import { EmployeeDTO } from 'src/app/models/table';
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue
} from '@angular/fire/firestore';
import { Employee } from './type';

export const employeeConverter: FirestoreDataConverter<Employee> = {
  toFirestore(employee: Employee): WithFieldValue<DocumentData> {
    const { employeeDTO } = employee;
    const data: EmployeeDTO = {
      name: employeeDTO.name,
      lastName: employeeDTO.lastName,
      role: employeeDTO.role,
      phone: employeeDTO.phone,
      zone: employeeDTO.zone,
      active: employeeDTO.active,
      createdAt: employeeDTO.createdAt ? employeeDTO.createdAt : new Date(),
      modificatedAt: new Date()
    };
    return data;
  },
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Employee {
    const data: EmployeeDTO = snapshot.data(options) as EmployeeDTO;
    const employee: Employee = {
      uid: snapshot.id,
      employeeDTO: {
        name: data.name,
        lastName: data.lastName,
        role: data.role,
        phone: data.phone,
        zone: data.zone,
        active: data.active,
        createdAt: new Date((data.createdAt as unknown as number) * 1000),
        modificatedAt: new Date((data.modificatedAt as unknown as number) * 1000)
      }
    };
    return employee;
  }
};
