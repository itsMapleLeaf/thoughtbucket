import { createTestUserCredentials } from "../support/helpers"

describe("/login", () => {
  it("allows logging in and redirects to /buckets", () => {
    const user = createTestUserCredentials()
    cy.request("POST", "/api/auth/signup", user)
    cy.request("POST", "/api/auth/logout") // make sure there's no session

    cy.visit("/login")
    cy.findByTestId("login-email").type(user.email)
    cy.findByTestId("login-password").type(user.password)
    cy.findByTestId("login-submit").click()
    cy.url().should("include", "/buckets")
  })

  it("redirects to buckets when logged in", () => {
    const user = createTestUserCredentials()
    cy.request("POST", "/api/auth/signup", user)
    cy.visit("/login")
    cy.url().should("include", "/buckets")
  })
})
