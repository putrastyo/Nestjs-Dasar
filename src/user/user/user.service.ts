import { Injectable } from '@nestjs/common';
import { ValidationService } from 'src/validation/validation/validation.service';
import { z } from 'zod';

@Injectable()
export class UserService {
  constructor(private validationService: ValidationService) {}

  getName(name: string): string {
    const scheme = z.string().min(3);
    const result = this.validationService.validate(scheme, name);

    return `Hello, ${result}`;
  }
}
