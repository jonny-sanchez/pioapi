export type FilesConfigProps = {
    nameFormData:string;
    maxFiles?:number;
    minFiles?:number;
    minSize?:number; //MB
    maxSize?:number; //MB
    allowedTypes?: ("image" | "pdf")[];
}