import { createTestUserCredentials } from "../support/helpers"

describe("auth", () => {
  it("supports signup", { retries: 1 }, () => {
    const user = createTestUserCredentials()

    const submitButton = () => cy.findByRole("button", { name: /sign\s*up/i })

    cy.visit("/signup")

    cy.findByRole("heading", { name: /sign\s*up/i }).should("be.visible")

    submitButton().click()
    cy.url().should("contain", "/signup") // should not submit

    cy.findByLabelText(/username/i).type(user.name)

    submitButton().click()
    cy.url().should("contain", "/signup") // should not submit

    cy.findByLabelText(/email/i).type(user.email)

    submitButton().click()
    cy.url().should("contain", "/signup") // should not submit

    cy.findByLabelText(/password/i).type("short")

    submitButton().click()
    cy.url().should("contain", "/signup") // should not submit

    cy.findByLabelText(/password/i).type(user.password)

    submitButton().click()

    cy.url().should("include", "/buckets") // sent to buckets after signup

    // ensure the session is persisted, and that / redirects to /buckets
    cy.visit("/")
    cy.url().should("include", "/buckets")

    cy.findByRole(/button|link/, { name: /(sign|log)\s*out/i }).click()
    cy.url().should("include", "/login")
  })

  it("supports login", () => {
    const user = createTestUserCredentials()

    function submitButton() {
      return cy.findByRole("button", { name: /log\s*in/i })
    }

    cy.request("POST", "/signup", user)
    cy.visit("/logout", { method: "POST" }) // ensure we're logged out

    cy.findByRole("heading", { name: /log\s*in/i }).should("be.visible")

    cy.findByLabelText(/email/i).type("invalidemail")

    submitButton().click()
    cy.url().should("contain", "/login") // should not submit

    cy.findByLabelText(/email/i).clear().type(user.email)

    submitButton().click()
    cy.url().should("contain", "/login") // should not submit

    cy.findByLabelText(/password/i).type("wrongpassword")

    submitButton().click()
    cy.url().should("contain", "/login") // should not submit

    cy.findByLabelText(/email/i).clear().type(user.email)
    cy.findByLabelText(/password/i)
      .clear()
      .type(user.password)
    submitButton().click()

    cy.url().should("include", "/buckets") // sent to buckets after login

    // ensure the session is persisted, and that / redirects to /buckets
    cy.visit("/")
    cy.url().should("include", "/buckets")

    cy.findByRole(/button|link/, { name: /(sign|log)\s*out/i }).click()
    cy.url().should("include", "/login")
  })
})
