export const PageTitleH1 = (props: any) => {
  const pageTitle = props.title ? props.title : "No title set";
  document.title = pageTitle + " : weestoater";

  return <h1 data-testid="page-title">{pageTitle}</h1>;
};
