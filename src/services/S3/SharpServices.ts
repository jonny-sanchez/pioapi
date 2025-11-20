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
            dataOptimized = await sharp(file.data)
                .rotate()
                .resize({ width: 2000, withoutEnlargement: true })
                .png({ 
                    compressionLevel: 9, 
                    adaptiveFiltering: true,
                    palette: true
                }).toBuffer()

        if(file.mimetype === 'image/jpeg' || file.mimetype === "image/jpg") 
            dataOptimized = await sharp(file.data)
                .rotate()
                .resize({ width: 2000, withoutEnlargement: true })
                .jpeg({ 
                    quality: 85, //95
                    mozjpeg: true,
                    chromaSubsampling: '4:2:0' 
                }).toBuffer()

        return dataOptimized
    }

}