declare module 'heic2any' {
  type Options = {
    blob: Blob;
    toType?: string;   // e.g. 'image/jpeg'
    quality?: number;  // 0..1
  };
  const heic2any: (opts: Options) => Promise<Blob | Blob[]>;
  export default heic2any;
}
