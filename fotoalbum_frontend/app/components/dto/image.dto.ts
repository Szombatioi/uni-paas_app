export interface ImageDto {
    fileName: string,
    name: string,
    date: Date
}

export interface ImageListDto {
    urlPrefix: string,
    images: ImageDto[]
}