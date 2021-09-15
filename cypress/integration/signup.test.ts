import { createTestUserCredentials } from "../support/helpers"

describe("/signup", () => {
  it("redirects to buckets after signup", () => {
    const user = createTestUserCredentials()
    cy.visit("/signup")
    cy.findByLabelText(/username/i).type(user.name)
    cy.findByLabelText(/email/i).type(user.email)
    cy.findByLabelText(/password/i).type(user.password)
    cy.findByRole("button", { name: /sign\s*up/i }).click()
    cy.url().should("include", "/buckets")
  })

  it("redirects to buckets when logged in", () => {
    const user = createTestUserCredentials()
    cy.request("POST", "/api/auth/signup", user)
    cy.visit("/signup")
    cy.url().should("include", "/buckets")
  })

  it("has a link to login", () => {
    cy.visit("/signup")
    cy.findByRole("link", { name: /log in/i }).click()
    cy.url().should("include", "/login")
  })
})
