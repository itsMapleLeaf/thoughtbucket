import { createTestUserCredentials } from "../support/helpers"

describe("bucket list page", () => {
  it("has a button to create a bucket", () => {
    const bucketName = `testbucket-${String(Math.random())}`

    cy.request("POST", "/api/auth/signup", createTestUserCredentials())
    cy.visit("/")
    cy.findByRole(/button|link/, { name: /new bucket/i }).click()
    cy.findByLabelText(/name/i).type(bucketName)
    cy.findByRole(/button/, { name: /create/i }).click()
    cy.findByText(bucketName).should("exist")
  })

  it("has a logout button", () => {
    cy.request("POST", "/api/auth/signup", createTestUserCredentials())
    cy.visit("/")
    cy.findByRole(/button|link/, { name: /log\s*out/i }).click()
    cy.url().should("include", "/login")
    cy.getCookie("session").should("not.exist")
  })
})
