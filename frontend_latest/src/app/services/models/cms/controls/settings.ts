export interface ISettings {
    text?: string;
    type?: string;
    offsetLG?: number;
    offsetMD?: number;
    offsetSM?: number;
    offsetXS?: number;
    sizeLG?: number;
    sizeMD?: number;
    sizeSM?: number;
    sizeXS?: number;
    url?: string;
    isExternalUrl?: boolean;
    title?: string;
    video_url?: string;
    video_caption?: string;
    image?: {alt: string; id: number; title: string; url: string; };
}
