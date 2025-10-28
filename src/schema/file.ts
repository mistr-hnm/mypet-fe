import * as z from 'zod/v4'

export const uploadFileSchema = z.object({
    file: z.file(),
})

export type UploadFileBody = z.infer<typeof uploadFileSchema>;


export interface FileDetails {
    id: number;
    filename: string;
    url: string;
    key: string;
}


export interface FileUploadResponse {
    status: boolean;
    message: string;
    data: FileDetails;
}

