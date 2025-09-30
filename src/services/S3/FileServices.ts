import { UploadedFile } from "express-fileupload";
import { client } from "../../config/S3Config";
import { v4 as uuidv4 } from 'uuid'
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { CarpetasS3Type, fileUploadSingleType } from "../../types/FilesTypes"; 

export default class FileServices {

    constructor() {}

    async fileUploadSingle(file?:UploadedFile | null, carpeta?:CarpetasS3Type) : Promise<fileUploadSingleType> {

        try {
            if(!file) throw new Error("No se recibio ningun archivo.")

            const nameFile = `${carpeta}/${uuidv4()}-${file?.name || 'default'}`

            const command = new PutObjectCommand({
                Bucket: `${process.env.AWS_BUCKET_NAME}`,
                Key: `${nameFile}`,
                Body: file.data,
                ContentType: file.mimetype
            })

            const result = await client.send(command)

            if(result.$metadata.httpStatusCode != 200) throw new Error("Error al subir la imagen (Servicio S3).");

            return { 
                nameFileKey: nameFile, 
                urlS3: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_BUCKET_REGION}.amazonaws.com/${nameFile}` 
            }
        } catch (error) {
            throw error
        }

    }
}