import { Request, Response, NextFunction } from "express";
import * as yup from "yup";
import { FilesConfigProps } from "../types/MiddlewareTypes";
import { BYTE } from "../utils/FilesHelpers";

const validateFields = (dto:yup.AnySchema, configFiles:FilesConfigProps[] | null = null) => async(req:Request, res:Response, next:NextFunction) =>{
    try {
        //validar campos dto
        await dto.validate(req.body, { abortEarly: false })
        //validar archivos
        if(configFiles) {
            configFiles.forEach(configFiles => {
                //validar si es requerido o no
                const required:boolean = configFiles?.required ?? false        
                const fileEntry:any = (req?.files ?? {})[configFiles.nameFormData] ?? null
                const files: any[] = Array.isArray(fileEntry) ? fileEntry : [fileEntry];

                // if(required) if(files.length <= 0) th
                // console.log(files)
                //validar en campo de entrada por form data
                if(required && !fileEntry) throw new Error(`el campo [${configFiles.nameFormData}] es obligatorio.`)
                if(!required && !fileEntry) return;
                //validar minimo de archivos por subir
                if(configFiles.minFiles && files.length < configFiles.minFiles) throw new Error(`Debes subir al menos ${configFiles.minFiles} archivo(s).`)
                //validar maximo de archivos por subir
                if(configFiles.maxFiles && files.length > configFiles.maxFiles) throw new Error(`Solo puedes subir un maximo de ${configFiles.maxFiles} archivo(s).`)
                //validar Size de cada archivo
                files.forEach((el, index)=> {
                    if(configFiles.minSize && el.size < BYTE(configFiles.minSize)) throw new Error(`El archivo [${el.name}] es muy pequeño. Tamaño mínimo: ${configFiles.minSize} MB.`)
                    if(configFiles.maxSize && el.size > BYTE(configFiles.maxSize)) throw new Error(`El archivo [${el.name}] es demasiado grande. Tamaño máximo: ${configFiles.maxSize} MB.`)
                    if(configFiles.allowedTypes){
                        const mime = el.mimetype; //"image/png", "application/pdf"
                    
                        const isImage = mime.startsWith("image/");
                        const isPdf = mime === "application/pdf";
                    
                        if(!((configFiles.allowedTypes.includes("image") && isImage) || (configFiles.allowedTypes.includes("pdf") && isPdf))) throw new Error(`El archivo [${el.name}] tiene un formato no permitido. Solo se aceptan imágenes o PDF.`);
                        
                    }
                })
            })
        } 
        next()
    } catch (error:any) {
        // console.log(error)
        const errores:any[] = error?.errors || []
        const textError = errores.join(', ') || error?.message || error?.stack || 'Error middleware validate Fields (message not found.)'
        return res.status(400).json({ message: textError, status: false, errors: errores, data: null })
    }
}

export default validateFields