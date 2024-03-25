import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'node:crypto';
import { ValueOf } from 'src/lib/types/types';
import { In, Repository } from 'typeorm';
import { S3ClientService } from '../s3-client/s3-client-service';
import { S3File } from './s3-file.entity';

export const S3Folder = {
  ROOT: '',
  AUCTION_IMAGES: '/auctions/images',
} as const;

export type S3FolderValues = ValueOf<typeof S3Folder>;

@Injectable()
export class S3FileService {
  constructor(
    private s3ClientService: S3ClientService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @InjectRepository(S3File) private s3FileRepository: Repository<S3File>,
  ) {}

  async removeByKeys(keys: string[]) {
    await this.s3FileRepository.manager.transaction(
      'SERIALIZABLE',
      async (transactionalEntityManager) => {
        for await (const key of keys) {
          await this.s3ClientService.deleteObject(key);
        }
        await transactionalEntityManager.getRepository(S3File).delete({
          key: In(keys),
        });
      },
    );
  }

  async remove(id: string) {
    const file = await this.s3FileRepository.findOne({
      where: { id },
    });
    await this.s3ClientService.deleteObject(file.key);
    return await this.s3FileRepository.delete({
      id,
    });
  }

  private constructKey(
    uuid: string,
    folder: S3FolderValues = S3Folder.ROOT,
  ): string {
    return [folder, uuid].join('/');
  }

  async create(
    files: Express.Multer.File[],
    folder: S3FolderValues = S3Folder.ROOT,
  ): Promise<S3File[]> {
    const results: S3File[] = [];

    for await (const file of files) {
      const key = this.constructKey(crypto.randomUUID(), folder);
      const name = file.originalname;
      const body = file.buffer;
      let S3OperationSuccess = false;

      try {
        await this.s3ClientService.putObject(key, body, file.mimetype);

        S3OperationSuccess = true;

        const result = await this.s3FileRepository.save({
          contentType: file.mimetype,
          key,
          name,
        });
        results.push(result);
      } catch (error_) {
        const error = error_ as Error;

        if (S3OperationSuccess) {
          await this.s3ClientService.deleteObject(key);
        }

        throw new InternalServerErrorException({ message: error.message });
      }
    }

    return results;
  }

  async getUrlByKey(key: string): Promise<string> {
    const cacheEntry = await this.cacheManager.get<string | null>(key);

    console.log('entry', cacheEntry);
    if (cacheEntry) {
      console.log('CACHE');
      return cacheEntry;
    }

    console.log('DB');
    const presignedUrl = await this.s3ClientService.getObjectPresignedUrl(key);
    await this.cacheManager.set(key, presignedUrl);

    return presignedUrl;
  }
}
