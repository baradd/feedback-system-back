import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
  Optional,
} from '@nestjs/common';
import { MulterModuleOptions } from '@nestjs/platform-express';
import { Observable, tap } from 'rxjs';
import {
  addRandomStringToFileName,
  createFolderIfNotExists,
  fileFilterForAvatar,
} from 'src/common/helpers/files.util';
import { MULTER_MODULE_OPTIONS } from '@nestjs/platform-express/multer/files.constants';
import * as multer from 'multer';
import { diskStorage } from 'multer';
import { join } from 'path';
import * as sharp from 'sharp';
import { unlinkSync, renameSync, unlink } from 'fs';

@Injectable()
export class AvatarUploadInterceptor implements NestInterceptor {
  protected options: MulterModuleOptions = {};
  constructor(
    @Optional()
    @Inject(MULTER_MODULE_OPTIONS)
    options: MulterModuleOptions,
  ) {
    this.options = options;
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    const dst = join('src', 'public', 'avatars/');
    createFolderIfNotExists(req.user.id, dst);

    await new Promise<void>((resolve, reject) => {
      multer({
        ...this.options,
        storage: diskStorage({
          destination: dst + req.user.id,
          filename: addRandomStringToFileName,
        }),
        fileFilter: fileFilterForAvatar(),
        limits: {
          fileSize: 1024 * 1024 * 5, // 5MB
        },
      }).single('avatar')(ctx.getRequest(), ctx.getResponse(), (err: any) => {
        if (err) {
          return reject(err);
        }

        return resolve();
      });
    });

    if (req.file && req.file.path) {
      const resizedPath = req.file.path.replace(/(\.\w+)$/, '_resized$1');

      await sharp(req.file.path)
        .resize(256, 256, { fit: 'cover' })
        .toFile(resizedPath);

      // remove original File

      unlinkSync(req.file.path);
      renameSync(resizedPath, req.file.path);
    }

    return next.handle();
  }
}
