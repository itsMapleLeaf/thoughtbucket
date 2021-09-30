import { nanoid } from "nanoid"
import { createTestUserCredentials } from "../support/helpers"

describe("thoughts", () => {
  it("supports editing", () => {
    cy.request("POST", "/signup", createTestUserCredentials())

    cy.visit({
      method: "POST",
      url: "/buckets",
      body: { name: `bucket-${nanoid()}` },
    })

    cy.location("pathname").then((path) => {
      cy.request("PATCH", path, {
        columns: [
          {
            id: nanoid(),
            name: "column-1",
            thoughts: [{ id: nanoid(), text: "hello world" }],
          },
          {
            id: nanoid(),
            name: "column-2",
            thoughts: [],
          },
        ],
      })
    })

    cy.reload()

    cy.findAllByTestId("thought-card")
      .first()
      .within(() => {
        // editing via edit/save button
        cy.root().should("contain", "hello world")
        cy.findByRole("button", { name: /edit/i }).click()
        cy.findByLabelText("text").clear().type("hello moon")
        cy.findByRole("button", { name: /save/i }).click()
        cy.root().should("not.contain", "hello world")
        cy.root().should("contain", "hello moon")

        // editing via blur
        cy.findByRole("button", { name: /edit/i }).click()
        cy.findByLabelText("text").clear().type("hello space").blur()
        cy.findByRole("button", { name: /edit/i }).should("exist")
        cy.root().should("not.contain", "hello moon")
        cy.root().should("contain", "hello space")
      })

    cy.findByTestId("fetch-status-success").should("exist")
    cy.reload()
    cy.findByText("hello space")
  })
})
