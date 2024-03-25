import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CustomImageValidationPipe
  implements PipeTransform<Express.Multer.File[]>
{
  private readonly MIME_TYPE: string;
  private readonly ORIGINAL_TYPE: string;
  private readonly MAX_FILE_SIZE: number;
  constructor(private configService: ConfigService) {
    this.MIME_TYPE = this.configService.getOrThrow(
      'IMAGE_VALIDATION_MIME_TYPE',
    );
    this.ORIGINAL_TYPE = this.configService.getOrThrow(
      'IMAGE_VALIDATION_ORIGINAL_TYPE',
    );
    this.MAX_FILE_SIZE = +this.configService.getOrThrow(
      'IMAGE_VALIDATION_MAX_FILE_SIZE',
    );
  }

  private validateFile(file: Express.Multer.File) {
    if (!file?.mimetype || !file?.originalname || !file?.size) {
      throw new BadRequestException({
        message: 'File was not found',
      });
    }
    if (
      !file.mimetype.match(this.MIME_TYPE) ||
      !file.originalname.match(this.ORIGINAL_TYPE)
    ) {
      throw new BadRequestException({
        message: 'Only jpg, jpeg ,png files allowed',
      });
    }
    if (
      Number.isInteger(Number.parseInt(file.size.toString())) &&
      file.size > this.MAX_FILE_SIZE
    ) {
      throw new BadRequestException({
        message: `Max file size: ${this.MAX_FILE_SIZE} Bytes`,
      });
    }
  }
  async transform(value: Express.Multer.File[]): Promise<any> {
    value.forEach((file) => {
      this.validateFile(file);
    });

    return value;
  }
}
