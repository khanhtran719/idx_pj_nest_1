import { PickType } from '@nestjs/swagger';

import { PaginateFilterRequest } from '@/system/dbs';

export class AllRequest extends PickType(PaginateFilterRequest, ['q']) {}
