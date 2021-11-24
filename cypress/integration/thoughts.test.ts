import { nanoid } from "nanoid"
import { createTestUserCredentials } from "../support/helpers"
import { runWithReload } from "../support/persistenceCheck"

describe("thoughts", () => {
  it("supports managing thoughts", { retries: 1 }, () => {
    const bucketName = `bucket-${String(Math.random())}`
    const thought1 = `thought-text-${String(Math.random())}`
    const thought2 = `thought-text-${String(Math.random())}`

    cy.request("POST", "/signup", createTestUserCredentials())
    cy.visit({ method: "POST", url: "/buckets", body: { name: bucketName } })

    cy.findByPlaceholderText(/new column/i).type(`column{enter}`)

    cy.findByPlaceholderText(/new thought/i).type(thought1)
    cy.findByRole("button", { name: /add thought/i }).click()
    cy.findByPlaceholderText(/new thought/i).type(thought2)
    cy.findByRole("button", { name: /add thought/i }).click()

    // check that the last thought is at the top
    runWithReload(() => {
      cy.findAllByText(/thought-text/i).should("have.length", 2)
      cy.findAllByText(/thought-text/i)
        .first()
        .should("contain", thought2)
      cy.findAllByText(/thought-text/i)
        .eq(1)
        .should("contain", thought1)
    })

    // delete all of the thoughts
    cy.findAllByRole("button", { name: /delete.*thought/i }).click({
      multiple: true,
    })

    runWithReload(() => {
      cy.findByText(thought1).should("not.exist")
      cy.findByText(thought2).should("not.exist")
    })
  })

  it("supports editing", () => {
    cy.request("POST", "/signup", createTestUserCredentials())

    cy.visit({
      method: "POST",
      url: "/buckets",
      body: { name: `bucket-${nanoid()}` },
    })

    cy.location("pathname").then((path) => {
      cy.request("PATCH", path, {
        columns: [
          {
            id: nanoid(),
            name: "column-1",
            thoughts: [{ id: nanoid(), text: "hello world" }],
          },
          {
            id: nanoid(),
            name: "column-2",
            thoughts: [],
          },
        ],
      })
    })

    cy.reload()

    cy.findAllByTestId("thought-card")
      .first()
      .within(() => {
        // editing via edit/save button
        cy.root().should("contain", "hello world")
        cy.findByRole("button", { name: /edit/i }).click()
        cy.findByLabelText("text").clear().type("hello moon")
        cy.findByRole("button", { name: /^save thought$/i }).click()
        cy.root().should("not.contain", "hello world")
        cy.root().should("contain", "hello moon")

        // editing via blur
        cy.findByRole("button", { name: /edit/i }).click()
        cy.findByLabelText("text").clear().type("hello space").blur()
        cy.findByRole("button", { name: /edit/i }).should("exist")
        cy.root().should("not.contain", "hello moon")
        cy.root().should("contain", "hello space")
      })

    cy.wait(300) // temporary until we can wait for a response
    cy.reload()
    cy.findByText("hello space")
  })
})
