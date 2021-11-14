import { nanoid } from "nanoid"
import { createTestUserCredentials } from "../support/helpers"

describe("head meta", () => {
  it("has the appropriate titles", () => {
    cy.visit("/login")
    cy.title().should("include", "log in")
    cy.visit("/signup")
    cy.title().should("include", "sign up")

    const name = `testbucket-${nanoid()}`
    cy.request("POST", "/signup", createTestUserCredentials())
    cy.visit({
      method: "POST",
      url: "/buckets",
      body: JSON.stringify({ name }),
      headers: { "Content-Type": "application/json" },
    })
    cy.title().should("include", name)
  })
})
