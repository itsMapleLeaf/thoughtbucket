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
      cy.url().should((u) => {
        expect(u).to.match(/\/buckets\/\w+$/)
      })
    }
  })

  it.skip("supports deletion from detail page", () => {
    const bucketName = `testbucket-${String(Math.random())}`

    cy.request("POST", "/signup", createTestUserCredentials())

    cy.visit({ url: `/buckets`, method: "POST", body: { name: bucketName } })

    cy.findByRole(/button|link/, { name: /delete/i }).click()

    cy.location().then(({ pathname }) => {
      expect(pathname).to.equal("/buckets")
    })
  })
})
