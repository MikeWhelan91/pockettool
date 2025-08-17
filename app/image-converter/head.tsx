export default function Head() {
  return (
    <>
      {/* SoftwareApplication schema */}
      <script
        key="ld-software-app"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "Utilixy Image Converter",
            applicationCategory: "MultimediaApplication",
            operatingSystem: "Web",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            description:
              "Convert, resize, crop, rotate, compress, watermark, strip metadata, and batch-download images (PNG, JPG, WebP, AVIF, HEIC) locally in your browser.",
            featureList: [
              "Convert between PNG, JPG, WebP, AVIF and HEIC",
              "Batch resize and ZIP download",
              "Crop with presets",
              "Rotate and flip",
              "Adjust quality to compress",
              "Add text watermarks",
              "Remove EXIF metadata",
              "Export images to a single PDF",
            ],
            url: "https://utilixy.com/image-converter",
            publisher: { "@type": "Organization", name: "Utilixy" },
          }),
        }}
      />
    </>
  );
}
