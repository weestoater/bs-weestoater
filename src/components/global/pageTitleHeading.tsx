export interface PageTitleH1Props {
  title?: string;
  hidden?: boolean;
}

export const PageTitleH1 = ({ title, hidden }: PageTitleH1Props) => {
  const pageTitle = title ?? "No title set";
  document.title = `${pageTitle} : weestoater`;

  return (
    <h1 data-testid="page-title" className={hidden ? "visually-hidden" : ""}>
      {pageTitle}
    </h1>
  );
};
