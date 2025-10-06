import { describe, test, expect } from "vitest";
import { goalScorersGridConfig } from "../../config/gridConfig";
import { themeAlpine } from "ag-grid-community";

describe("Grid Configuration", () => {
  test("goalScorersGridConfig has correct column definitions", () => {
    expect(goalScorersGridConfig.columnDefs).toHaveLength(3);
    expect(goalScorersGridConfig.columnDefs).toEqual([
      { field: "player", flex: 2.5 },
      { field: "goals" },
      { field: "assists" },
    ]);
  });

  test("goalScorersGridConfig has correct default column properties", () => {
    const defaultColDef = goalScorersGridConfig.defaultColDef;
    expect(defaultColDef).toEqual({
      sortable: true,
      filter: true,
      flex: 1,
    });
  });

  test("goalScorersGridConfig uses Alpine theme", () => {
    expect(goalScorersGridConfig.theme).toBe(themeAlpine);
  });

  test("goalScorersGridConfig is properly typed as GridOptions", () => {
    expect(goalScorersGridConfig).toHaveProperty("columnDefs");
    expect(goalScorersGridConfig).toHaveProperty("defaultColDef");
    expect(goalScorersGridConfig).toHaveProperty("theme");
  });
});
