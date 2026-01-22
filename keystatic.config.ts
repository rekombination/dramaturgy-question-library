import { config, fields, collection, singleton } from "@keystatic/core";

const isProduction = process.env.NODE_ENV === "production";

export default config({
  storage: isProduction
    ? {
        kind: "github",
        repo: "rekombination/dramaturgy-question-library",
      }
    : {
        kind: "local",
      },
  ui: {
    brand: {
      name: "The Dramaturgy",
    },
  },
  collections: {
    posts: collection({
      label: "Blog Posts",
      slugField: "title",
      path: "content/posts/*",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        description: fields.text({
          label: "Description",
          multiline: true,
          validation: { length: { min: 50, max: 160 } },
        }),
        publishedAt: fields.date({
          label: "Published Date",
        }),
        updatedAt: fields.date({
          label: "Last Updated",
        }),
        coverImage: fields.image({
          label: "Cover Image",
          directory: "public/images/posts",
          publicPath: "/images/posts",
        }),
        author: fields.text({
          label: "Author",
          defaultValue: "The Dramaturgy Team",
        }),
        tags: fields.array(
          fields.text({ label: "Tag" }),
          {
            label: "Tags",
            itemLabel: (props) => props.value,
          }
        ),
        content: fields.document({
          label: "Content",
          formatting: true,
          dividers: true,
          links: true,
          images: {
            directory: "public/images/posts",
            publicPath: "/images/posts",
          },
        }),
        // SEO Fields
        metaTitle: fields.text({
          label: "Meta Title (SEO)",
          description: "Optional. If empty, uses the post title. Max 60 characters.",
          validation: { length: { max: 60 } },
        }),
        metaDescription: fields.text({
          label: "Meta Description (SEO)",
          description: "Optional. If empty, uses the post description. Max 160 characters.",
          multiline: true,
          validation: { length: { max: 160 } },
        }),
        ogImage: fields.image({
          label: "Open Graph Image",
          description: "Optional. If empty, uses the cover image. Recommended: 1200x630px",
          directory: "public/images/posts/og",
          publicPath: "/images/posts/og",
        }),
        twitterCard: fields.select({
          label: "Twitter Card Type",
          options: [
            { label: "Summary Large Image", value: "summary_large_image" },
            { label: "Summary", value: "summary" },
          ],
          defaultValue: "summary_large_image",
        }),
        keywords: fields.array(
          fields.text({ label: "Keyword" }),
          {
            label: "SEO Keywords",
            description: "Additional keywords for SEO (optional)",
            itemLabel: (props) => props.value,
          }
        ),
        canonicalUrl: fields.text({
          label: "Canonical URL",
          description: "Optional. Full URL if this content was published elsewhere first.",
        }),
      },
    }),
  },
  singletons: {
    homepage: singleton({
      label: "Homepage",
      path: "content/pages/homepage",
      schema: {
        heroTitle: fields.text({
          label: "Hero Title",
          multiline: true,
        }),
        heroSubtitle: fields.text({
          label: "Hero Subtitle",
          multiline: true,
        }),
        quote: fields.text({
          label: "Featured Quote",
          multiline: true,
        }),
        quoteAttribution: fields.text({
          label: "Quote Attribution",
        }),
      },
    }),
    about: singleton({
      label: "About Page",
      path: "content/pages/about",
      schema: {
        title: fields.text({ label: "Title" }),
        subtitle: fields.text({ label: "Subtitle" }),
        content: fields.document({
          label: "Content",
          formatting: true,
          dividers: true,
          links: true,
          images: {
            directory: "public/images/pages",
            publicPath: "/images/pages",
          },
        }),
      },
    }),
    guidelines: singleton({
      label: "Guidelines Page",
      path: "content/pages/guidelines",
      schema: {
        title: fields.text({ label: "Title" }),
        subtitle: fields.text({ label: "Subtitle" }),
        content: fields.document({
          label: "Content",
          formatting: true,
          dividers: true,
          links: true,
          images: {
            directory: "public/images/pages",
            publicPath: "/images/pages",
          },
        }),
      },
    }),
  },
});
