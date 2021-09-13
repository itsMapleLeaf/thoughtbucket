import { createTestUserCredentials } from "../support/helpers"

describe("/", () => {
  it("redirects to login when logged out", () => {
    cy.visit("/")
    cy.url().should("include", "/login")
  })

  it("redirects to buckets when logged in", () => {
    cy.request("POST", "/api/signup", createTestUserCredentials())
    cy.visit("/")
    cy.url().should("include", "/buckets")
  })
})
