import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { S3ClientModule } from 'src/s3-client/s3-client.module';
import { S3File } from './s3-file.entity';
import { S3FileService } from './s3-file.service';

@Module({
  providers: [S3FileService],
  imports: [TypeOrmModule.forFeature([S3File]), S3ClientModule],
  exports: [S3FileService],
})
export class S3FileModule {}
