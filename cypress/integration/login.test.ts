import { createTestUserCredentials } from "../support/helpers"

describe("/login", () => {
  it("allows logging in and redirects to /buckets", () => {
    const user = createTestUserCredentials()
    cy.request("POST", "/api/auth/signup", user)
    cy.request("POST", "/api/auth/logout") // make sure there's no session

    cy.visit("/login")
    cy.findByLabelText(/email/i).type(user.email)
    cy.findByLabelText(/password/i).type(user.password)
    cy.findByRole("button", { name: /log\s*in/i }).click()
    cy.url().should("include", "/buckets")
  })

  it("redirects to buckets when logged in", () => {
    const user = createTestUserCredentials()
    cy.request("POST", "/api/auth/signup", user)
    cy.visit("/login")
    cy.url().should("include", "/buckets")
  })

  it("has a link to signup", () => {
    cy.visit("/login")
    cy.findByRole("link", { name: /sign\s*up/i }).click()
    cy.url().should("include", "/signup")
  })
})
