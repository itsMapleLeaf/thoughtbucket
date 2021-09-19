import { createTestUserCredentials } from "../support/helpers"

describe("feature: buckets", () => {
  it("has a ui to create buckets", () => {
    const bucketName = `testbucket-${String(Math.random())}`

    // bucket creation requires auth
    cy.request("POST", "/signup", createTestUserCredentials())
    cy.visit("/buckets")

    // creation flow
    cy.findByRole(/button|link/, { name: /new bucket/i }).click()
    cy.findByLabelText(/name/i).type(bucketName)
    cy.findByRole(/button/i, { name: /create/i }).click()

    // need to show the bucket name in a heading
    cy.findByRole("heading", { name: bucketName }).should("exist")
  })

  it("lists created buckets", () => {
    const bucketNames = [
      `testbucket-${String(Math.random())}`,
      `testbucket-${String(Math.random())}`,
      `testbucket-${String(Math.random())}`,
    ]

    // bucket creation requires auth
    cy.request("POST", "/signup", createTestUserCredentials())

    // create some buckets
    for (const name of bucketNames) {
      cy.request("POST", "/buckets", { name })
    }

    // check that all buckets are listed and lead to their detail pages
    for (const name of bucketNames) {
      cy.visit("/buckets")
      cy.findByRole("link", { name: (n) => n.includes(name) }).click()
      cy.location("pathname").should("match", /\/buckets\/\w+$/)
    }
  })

  it("supports deletion from detail page", () => {
    const bucketName = `bucket-${String(Math.random())}`

    cy.request("POST", "/signup", createTestUserCredentials())
    cy.visit({ method: "POST", url: "/buckets", body: { name: bucketName } })

    cy.findByTestId("bucket-page-delete")
      .click()
      .its("contents")
      .should("include", /delete/i)

    cy.findByRole("button", { name: /delete/i }).click()
    cy.location("pathname").should("eq", "/buckets")
    cy.findByText(bucketName).should("not.exist")
  })

  it("supports managing columns", () => {
    const bucketName = `bucket-${String(Math.random())}`

    cy.request("POST", "/signup", createTestUserCredentials())
    cy.visit({ method: "POST", url: "/buckets", body: { name: bucketName } })

    // submit by pressing enter
    const columnName1 = `column-${String(Math.random())}`
    cy.findByPlaceholderText(/new column/i).type(`${columnName1}{enter}`)
    cy.findByRole("heading", { name: columnName1 }).should("exist")

    // submit by clicking the submit button
    const columnName2 = `column-${String(Math.random())}`
    cy.findByPlaceholderText(/new column/i).type(`${columnName2}`)
    cy.findByRole("button", { name: /add column/i }).click()
    cy.findByRole("heading", { name: columnName2 }).should("exist")

    // delete all columns
    cy.findAllByRole("button", { name: /delete.*column/i }).click({
      multiple: true,
    })
    cy.findByRole("heading", { name: columnName1 }).should("not.exist")
    cy.findByRole("heading", { name: columnName2 }).should("not.exist")
  })
})
