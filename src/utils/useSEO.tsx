import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
}

/**
 * Custom hook to manage SEO meta tags for each page
 * Updates document title and meta tags dynamically
 */
export const useSEO = ({
  title = "weestoater",
  description = "Ian Burrett's portfolio - Full-stack web developer specializing in React, TypeScript, and accessible web design.",
  keywords = "Ian Burrett, web developer, React, TypeScript, accessibility",
  ogTitle,
  ogDescription,
}: SEOProps) => {
  useEffect(() => {
    // Update document title
    document.title = title.includes("weestoater")
      ? title
      : `${title} - weestoater`;

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", description);
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute("content", keywords);
    }

    // Update Open Graph title
    const ogTitleTag = document.querySelector('meta[property="og:title"]');
    if (ogTitleTag) {
      ogTitleTag.setAttribute("content", ogTitle || title);
    }

    // Update Open Graph description
    const ogDescTag = document.querySelector('meta[property="og:description"]');
    if (ogDescTag) {
      ogDescTag.setAttribute("content", ogDescription || description);
    }

    // Update Twitter Card title
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      twitterTitle.setAttribute("content", ogTitle || title);
    }

    // Update Twitter Card description
    const twitterDesc = document.querySelector(
      'meta[name="twitter:description"]'
    );
    if (twitterDesc) {
      twitterDesc.setAttribute("content", ogDescription || description);
    }
  }, [title, description, keywords, ogTitle, ogDescription]);
};
