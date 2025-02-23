describe("weestoater spec", () => {
  it("home page has two cards", () => {
    cy.visit("/");
    cy.findByText("Welcome");
    cy.findByText("Ethos");
    cy.findByText("trial & error");
  });
});
