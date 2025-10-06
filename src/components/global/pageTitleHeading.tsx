export interface PageTitleH1Props {
  title?: string;
}

export const PageTitleH1 = ({ title }: PageTitleH1Props) => {
  const pageTitle = title ?? "No title set";
  document.title = `${pageTitle} : weestoater`;

  return <h1 data-testid="page-title">{pageTitle}</h1>;
};
