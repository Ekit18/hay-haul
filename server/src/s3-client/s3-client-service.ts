import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  type DeleteObjectCommandOutput,
  type PutObjectCommandOutput,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
class S3ClientService {
  private s3Client: S3Client;

  private bucketName: string;

  private signedUrlExpiresIn: number;

  public constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: configService.getOrThrow('S3_REGION', { infer: true }),
      credentials: {
        accessKeyId: configService.getOrThrow('S3_AWS_ACCESS_KEY_ID', {
          infer: true,
        }),
        secretAccessKey: configService.getOrThrow('S3_AWS_SECRET_ACCESS_KEY', {
          infer: true,
        }),
        sessionToken: configService.getOrThrow('S3_AWS_SESSION_TOKEN', {
          infer: true,
        }),
      },
    });
    this.bucketName = configService.getOrThrow('S3_BUCKET_NAME', {
      infer: true,
    });
    this.signedUrlExpiresIn = Number(
      configService.getOrThrow('S3_SIGNED_URL_EXPIRES_IN_SECONDS', {
        infer: true,
      }),
    );
  }

  public async getObjectBuffer(key: string): Promise<Buffer | null> {
    const command = new GetObjectCommand({ Bucket: this.bucketName, Key: key });
    const result = await this.s3Client.send(command);
    if (!result.Body) {
      return null;
    }

    const contents = await result.Body.transformToByteArray();

    return Buffer.from(contents);
  }

  public async getObjectPresignedUrl(
    key: string,
    expiresIn: number = this.signedUrlExpiresIn,
  ): Promise<string> {
    const command = new GetObjectCommand({ Bucket: this.bucketName, Key: key });

    return await getSignedUrl(this.s3Client, command, {
      expiresIn,
    });
  }

  public async putObject(
    key: string,
    body: Buffer,
    contentType?: string,
  ): Promise<PutObjectCommandOutput> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: body,
      ContentType: contentType,
    });
    return await this.s3Client.send(command);
  }

  public async updateObjectKey(
    oldKey: string,
    newKey: string,
  ): Promise<PutObjectCommandOutput | null> {
    const oldObject = await this.getObjectBuffer(oldKey);

    if (!oldObject) {
      return null;
    }

    await this.deleteObject(oldKey);

    return await this.putObject(newKey, oldObject);
  }

  public async deleteObject(key: string): Promise<DeleteObjectCommandOutput> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    return await this.s3Client.send(command);
  }
}

export { S3ClientService };
