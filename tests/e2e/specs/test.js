// https://docs.cypress.io/api/table-of-contents

import { cyan } from "@tailwindcss/postcss7-compat/colors";

describe("Sanity Test", () => {
  it("Visits the app root url", () => {
    cy.visit("/");
    cy.contains("h1", "Listen to Great Music!");
  });
});
