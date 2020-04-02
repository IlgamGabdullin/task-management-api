import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';

@Injectable()
export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.OPEN,
    TaskStatus.INPROGRESS,
    TaskStatus.DONE
  ];

  transform(value: string) {
    value = value.toUpperCase();

    if (this.allowedStatuses.includes(value as TaskStatus)) {
      return value
    } else {
      throw new BadRequestException('This status is not acceptable');
    }
  }
}