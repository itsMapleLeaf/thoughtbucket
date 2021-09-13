import { createTestUserCredentials } from "../support/helpers"

describe("/signup", () => {
  it("redirects to buckets after signup", () => {
    const user = createTestUserCredentials()
    cy.visit("/signup")
    cy.findByLabelText(/username/i).type(user.name)
    cy.findByLabelText(/email/i).type(user.email)
    cy.findByLabelText(/password/i).type(user.password)
    cy.findByTestId("signup-submit").click()
    cy.url().should("include", "/buckets")
  })
})
