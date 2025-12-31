/**
 * Common mocks that can be reused across test files
 * This reduces redundant mock setup and improves test performance
 */

export const mockPageTitleH1 = {
  PageTitleH1: ({ title }: { title: string }) => <h1>{title}</h1>,
};

export const mockAgCharts = {
  AgCharts: ({ options }: { options: unknown }) => (
    <div data-testid="ag-charts">
      <span>Chart Data: {options ? "Present" : "Not Present"}</span>
    </div>
  ),
};

export const mockAgGrid = {
  AgGridReact: ({ rowData }: { rowData: unknown[] }) => (
    <div data-testid="ag-grid">
      <span>Grid Rows: {rowData?.length || 0}</span>
    </div>
  ),
};
