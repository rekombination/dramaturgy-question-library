import { config, fields, collection, singleton } from "@keystatic/core";

export default config({
  storage: {
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
        }),
        publishedAt: fields.date({
          label: "Published Date",
        }),
        coverImage: fields.image({
          label: "Cover Image",
          directory: "public/images/posts",
          publicPath: "/images/posts",
        }),
        author: fields.text({
          label: "Author",
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
