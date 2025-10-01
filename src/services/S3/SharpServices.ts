import { UploadedFile } from "express-fileupload";
import { injectable } from "tsyringe";
import sharp from "sharp";

@injectable()
export default class SharpServices {

    constructor() {}

    async optimizedFileBuffer(file:UploadedFile) : Promise<any> {

        let dataOptimized = file.data;

        // if(!file.mimetype.startsWith("image/")) return dataOptimized

        if(file.mimetype === 'image/png') 
            dataOptimized = await sharp(file.data).png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer()

        if(file.mimetype === 'image/jpeg' || file.mimetype === "image/jpg") 
            dataOptimized = await sharp(file.data).jpeg({ quality: 95, mozjpeg: true }).toBuffer()

        return dataOptimized
    }

}