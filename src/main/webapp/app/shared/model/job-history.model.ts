import { IJob } from '@/shared/model/job.model';
import { IDepartment } from '@/shared/model/department.model';
import { IEmployee } from '@/shared/model/employee.model';

import { Language } from '@/shared/model/enumerations/language.model';
export interface IJobHistory {
  id?: number;
  startDate?: Date | null;
  endDate?: Date | null;
  language?: Language | null;
  fileContentType?: string | null;
  file?: string | null;
  date?: Date | null;
  duration?: string | null;
  job?: IJob | null;
  department?: IDepartment | null;
  employee?: IEmployee | null;
}

export class JobHistory implements IJobHistory {
  constructor(
    public id?: number,
    public startDate?: Date | null,
    public endDate?: Date | null,
    public language?: Language | null,
    public fileContentType?: string | null,
    public file?: string | null,
    public date?: Date | null,
    public duration?: string | null,
    public job?: IJob | null,
    public department?: IDepartment | null,
    public employee?: IEmployee | null
  ) {}
}
