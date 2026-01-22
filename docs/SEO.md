# SEO Implementation Guide

This document describes the comprehensive SEO implementation for The Dramaturgy blog and content.

## Overview

The site implements enterprise-level SEO with:
- Complete Open Graph metadata
- Twitter Card optimization
- Schema.org structured data (JSON-LD)
- Canonical URLs
- Meta descriptions and keywords
- Breadcrumb navigation
- Article metadata

## Blog Post SEO Fields (Keystatic)

When creating or editing blog posts in Keystatic, you have access to advanced SEO settings:

### Basic Fields
- **Title**: Main post title (also used for SEO if no meta title is set)
- **Description**: Post description (50-160 characters, used for SEO if no meta description is set)
- **Published Date**: When the article was first published
- **Updated Date**: Last modification date (important for search engines)
- **Cover Image**: Main image (also used for OG/Twitter if no custom OG image is set)
- **Author**: Author name
- **Tags**: Content tags (also added to meta keywords)

### Advanced SEO Settings (`seo` object)

#### Meta Title
- **Field**: `metaTitle`
- **Max Length**: 60 characters
- **Purpose**: Optimized title for search results
- **Default**: Uses post title if empty

#### Meta Description
- **Field**: `metaDescription`
- **Length**: Max 160 characters
- **Purpose**: Search result snippet text
- **Default**: Uses post description if empty

#### Open Graph Image
- **Field**: `ogImage`
- **Recommended Size**: 1200x630px
- **Purpose**: Custom image for social media shares
- **Default**: Uses cover image if not set

#### Twitter Card Type
- **Field**: `twitterCard`
- **Options**:
  - `summary_large_image` (default, recommended)
  - `summary`
- **Purpose**: How the post appears on Twitter/X

#### SEO Keywords
- **Field**: `keywords`
- **Purpose**: Additional keywords beyond tags
- **Combined with**: Post tags for full keyword list

#### Canonical URL
- **Field**: `canonicalUrl`
- **Purpose**: For syndicated content or cross-posting
- **Usage**: Set if content was published elsewhere first

## Schema.org Structured Data

### Article Schema
Every blog post includes Article schema with:
- Headline and description
- Publication and modification dates
- Author information
- Publisher (The Dramaturgy organization)
- Main image
- Article URL

### Blog Listing Schema
The `/blog` page includes Blog schema with:
- All published posts as BlogPosting entities
- Proper date and author attribution
- Images for each post

### Breadcrumb Schema
Individual post pages include breadcrumb navigation:
- Home → Blog → Article Title
- Helps search engines understand site structure

### Organization Schema
Site-wide organization schema in root layout:
- Organization name and logo
- Contact information
- Social media links

### WebSite Schema
Site-wide website schema with:
- Search action (for Google search box)
- Multilingual support (en/de)

## Meta Tags Generated

For each blog post, the following meta tags are automatically generated:

```html
<!-- Basic Meta -->
<title>Post Title | thedramaturgy.com</title>
<meta name="description" content="..." />
<meta name="keywords" content="..." />

<!-- Open Graph -->
<meta property="og:type" content="article" />
<meta property="og:url" content="..." />
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:image" content="..." />
<meta property="article:published_time" content="..." />
<meta property="article:modified_time" content="..." />
<meta property="article:author" content="..." />
<meta property="article:tag" content="..." />

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="..." />
<meta name="twitter:description" content="..." />
<meta name="twitter:image" content="..." />

<!-- Canonical -->
<link rel="canonical" href="..." />
```

## Best Practices

### Title Optimization
- Keep titles under 60 characters
- Include primary keyword near the beginning
- Make it compelling for click-through
- Use the `metaTitle` field for SEO-optimized versions

### Description Optimization
- Keep descriptions 50-160 characters
- Include a call-to-action
- Summarize the key value proposition
- Use the `metaDescription` field for search-optimized text

### Image Optimization
- Cover images: Minimum 1200x630px (2:1 aspect ratio)
- OG images: Exactly 1200x630px for best social media display
- Use descriptive alt text (automatically uses post title)
- File size: Keep under 1MB for performance

### Keyword Strategy
- Use 3-5 relevant tags per post
- Add 2-3 additional SEO keywords if needed
- Avoid keyword stuffing
- Focus on long-tail keywords for niche topics

### Content Updates
- Update the `updatedAt` field when making significant changes
- Search engines favor fresh, updated content
- Consider updating old posts with new information

### Canonical URLs
- Only set if content is republished from another source
- Use the original publication URL
- Leave empty for original content

## Testing SEO Implementation

### Validate Structured Data
1. Use [Google's Rich Results Test](https://search.google.com/test/rich-results)
2. Enter your blog post URL
3. Verify Article schema is valid

### Check Open Graph
1. Use [Facebook's Sharing Debugger](https://developers.facebook.com/tools/debug/)
2. Enter your blog post URL
3. Verify image and text appear correctly

### Check Twitter Card
1. Use [Twitter Card Validator](https://cards-dev.twitter.com/validator)
2. Enter your blog post URL
3. Verify card displays properly

### Performance Testing
1. Use [PageSpeed Insights](https://pagespeed.web.dev/)
2. Check both mobile and desktop scores
3. Ensure SEO score is 90+

## File Locations

### SEO Components
- `src/components/seo/JsonLd.tsx` - All Schema.org components

### Blog Pages
- `src/app/(public)/blog/page.tsx` - Blog listing with metadata
- `src/app/(public)/blog/[slug]/page.tsx` - Individual posts with full SEO

### Configuration
- `keystatic.config.ts` - Content schema with SEO fields

### Root Layout
- `src/app/layout.tsx` - Site-wide meta and organization schema

## Future Enhancements

Consider adding:
- Sitemap.xml generation
- robots.txt optimization
- RSS feed for blog posts
- AMP versions of articles
- Multi-language support for SEO
- FAQ schema for Q&A content
- Video schema for embedded content
