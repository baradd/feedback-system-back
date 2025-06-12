import { Request } from 'express';
import * as fs from 'fs'
import { extname } from 'path';

export const createFolderIfNotExists = (foldername: string, dst: string) => {
    const folder = dst + foldername
    try {
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }
    } catch (error) {
        throw new Error(`Failed to create folder: ${folder}`);
    }
}

export const addRandomStringToFileName = (req: Request, file: any, callback: any) => {

    const name = Buffer.from(file.originalname, 'latin1').toString('utf8').split('.')[0]
    const fileExtName = extname(file.originalname)
    const randomName = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
    callback(null, `${name}-${randomName}${fileExtName}`)
}

export const fileFilterForAvatar = () => {
    return (req: Request, file: any, callback: any) => {
        const mimetype = file.mimetype.toLowerCase()

        const isAllowed = mimetype.match(/\/(jpg|jpeg|png)$/)

        if (isAllowed)
            return callback(null, true)
        return callback(new Error('Invalid file type'), false)
    }
}   