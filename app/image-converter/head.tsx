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
              "Convert, resize and batch-download images (PNG, JPG, WebP, AVIF, HEIC) locally in your browser.",
            url: "https://utilixy.com/image-converter",
            publisher: { "@type": "Organization", name: "Utilixy" },
          }),
        }}
      />

      {/* FAQPage schema */}
      <script
        key="ld-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "Is anything uploaded to a server?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "No. All conversions run locally in your browser—files never leave your device.",
                },
              },
              {
                "@type": "Question",
                name: "Which formats can I convert?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "PNG, JPEG/JPG, WebP, AVIF and HEIC (iPhone photos) are supported as inputs. Outputs include PNG, JPG, WebP and AVIF.",
                },
              },
              {
                "@type": "Question",
                name: "Can I resize images at the same time?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes. Enter a width and/or height before clicking Convert. Leave a field blank to preserve the original dimension.",
                },
              },
              {
                "@type": "Question",
                name: "Is the tool free?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes—100 % free and ad-supported. No signup required.",
                },
              },
              {
                "@type": "Question",
                name: "Does it work offline?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Once the page is loaded it keeps working without internet, because all logic is client-side JavaScript.",
                },
              },
            ],
          }),
        }}
      />
    </>
  );
}

<meta
  name="description"
  content="Convert images locally to PNG, JPEG, WEBP, HEIC, and AVIF. Resize, set quality, and download—no uploads, sign-up, pop-ups, or redirects."
/>;
