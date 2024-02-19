import { Controller } from '@nestjs/common';
import { ProductTypeService } from './product-type.service';

@Controller('product-type')
export class ProductTypeController {
  public constructor(private readonly productTypeService: ProductTypeService) {}
}
