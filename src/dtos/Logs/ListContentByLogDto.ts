import * as yup from "yup";

export const ListContentByLogDto = yup.object({
    name_file: yup.string().required("El [name_file] es un campo obligatorio")
}).required()

export type ListContentByLogDtoType = yup.InferType<typeof ListContentByLogDto>