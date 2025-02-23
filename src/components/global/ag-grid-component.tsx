// import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
// import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
// import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the Data Grid

export const WSGridComponent = (props: any) => {
  const gridData = props.data ? props.data : null;

  return (
    <>
      {gridData !== null && (
        <>
          <strong>data goes here</strong>
          <br />
          <code>{JSON.stringify(gridData)}</code>
        </>
      )}
      {gridData === null && <>No data found</>}
    </>
  );
};
