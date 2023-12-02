export interface ImageMetadata {
  image: {
    Make?: string;
    Model?: string;
    Software?: string;
    ModifyDate?: string;
    ExifOffset?: number;
  };
  thumbnail: {
    Compression?: number;
    XResolution?: number;
    YResolution?: number;
    ResolutionUnit?: number;
    ThumbnailOffset?: number;
    ThumbnailLength?: number;
  };
  exif: {
    ExposureTime?: number;
    FNumber?: number;
    ExposureProgram?: number;
    ISO?: number;
    ExifVersion?: {
      type?: string;
      data?: number[];
    };
    DateTimeOriginal?: string;
    CreateDate?: string;
    ShutterSpeedValue?: number;
    ApertureValue?: number;
    ExposureCompensation?: number;
    MaxApertureValue?: number;
    MeteringMode?: number;
    LightSource?: number;
    Flash?: number;
    FocalLength?: number;
    SubSecTimeOriginal?: string;
    SubSecTimeDigitized?: string;
    ColorSpace?: number;
    SensingMethod?: number;
    FileSource?: {
      type?: string;
      data?: number[];
    };
    SceneType?: {
      type?: string;
      data?: number[];
    };
    CFAPattern?: {
      type?: string;
      data?: number[];
    };
    CustomRendered?: number;
    ExposureMode?: number;
    WhiteBalance?: number;
    DigitalZoomRatio?: number;
    FocalLengthIn35mmFormat?: number;
    SceneCaptureType?: number;
    GainControl?: number;
    Contrast?: number;
    Saturation?: number;
    Sharpness?: number;
    SubjectDistanceRange?: number;
    SerialNumber?: string;
    LensInfo?: number[];
    LensModel?: string;
  };
  gps?: object;
  interoperability?: object;
  makernote?: object;
}

export type category = "landscape" | "mobile" | "portrait" | "me";
export type orientation = "horizontal" | "vertical" | "square";

export interface ImageInfo {
  name: string;
  pathJpg: string;
  pathWebp: string;
  metadata: ImageMetadata;
  description: string;
  category: string[];
  orientation: string;
}

export interface TotalInfo {
  totalCount: number;
  resize: null | number;
  quality: number;
}

export interface TypedJSON {
  optimizedImages: Record<string, ImageInfo>;
  totalInfo: TotalInfo;
}

export interface SocialLink {
  icon: string;
  color: string;
  name: string;
  size: string | number;
  link: string;
}

export interface SocialLinksInfo {
  [key: string]: SocialLink;
}

export type RouteInfo = {
  path: string;
  name: string;
  otherPath: boolean;
};

export type language = "en" | "ru";
export type theme = "light" | "dark";
export type platform = "react" | "vue";
export type filterPhoto = "landscape" | "mobile" | "portrait" | "me" | "all";
export type filterProject = "vanilla" | "react" | "vue" | "other" | "all";
