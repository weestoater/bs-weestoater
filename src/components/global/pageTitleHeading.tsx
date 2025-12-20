import { useSEO } from "../../utils/useSEO";

export interface PageTitleH1Props {
  title?: string;
  hidden?: boolean;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
}

export const PageTitleH1 = ({
  title,
  hidden,
  description,
  keywords,
  ogTitle,
  ogDescription,
}: PageTitleH1Props) => {
  const pageTitle = title ?? "No title set";

  useSEO({
    title: pageTitle,
    description,
    keywords,
    ogTitle,
    ogDescription,
  });

  return (
    <h1 data-testid="page-title" className={hidden ? "visually-hidden" : ""}>
      {pageTitle}
    </h1>
  );
};
