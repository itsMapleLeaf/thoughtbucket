import { nanoid } from "nanoid"
import { createTestUserCredentials } from "../support/helpers"
import { persistenceCheck } from "../support/persistenceCheck"

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

    // submit by clicking the submit button
    const columnName2 = `column-${String(Math.random())}`
    cy.findByPlaceholderText(/new column/i).type(`${columnName2}`)
    cy.findByRole("button", { name: /add column/i }).click()

    persistenceCheck(() => {
      cy.findByRole("heading", { name: columnName1 }).should("exist")
      cy.findByRole("heading", { name: columnName2 }).should("exist")
    })

    // delete all columns
    cy.findAllByRole("button", { name: /delete.*column/i }).click({
      multiple: true,
    })

    persistenceCheck(() => {
      cy.findByRole("heading", { name: columnName1 }).should("not.exist")
      cy.findByRole("heading", { name: columnName2 }).should("not.exist")
    })
  })

  it("supports managing thoughts", () => {
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
    persistenceCheck(() => {
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

    persistenceCheck(() => {
      cy.findByText(thought1).should("not.exist")
      cy.findByText(thought2).should("not.exist")
    })
  })

  it("supports drag n drop", () => {
    const bucketName = `bucket-${nanoid()}`

    const initialThoughts = [
      `thought-text-1`,
      `thought-text-2`,
      `thought-text-3`,
    ]

    cy.request("POST", "/signup", createTestUserCredentials())
    cy.visit({ method: "POST", url: "/buckets", body: { name: bucketName } })

    function setupColumns() {
      cy.location("pathname").then((path) => {
        cy.request("PATCH", path, {
          name: bucketName,
          columns: [
            {
              id: nanoid(),
              name: "column-1",
              thoughts: initialThoughts.map((text) => ({
                id: nanoid(),
                text,
              })),
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
    }

    function assertThoughtTexts(columns: string[][]) {
      cy.findAllByTestId("column-card").each((column, index) => {
        cy.wrap(column).within(() => {
          const thoughtTexts = columns[index]

          cy.findAllByTestId("thought-card").should(
            "have.length",
            thoughtTexts.length,
          )

          for (const [index, text] of thoughtTexts.entries()) {
            cy.findAllByTestId("thought-card")
              .eq(index)
              .should("include.text", text)
          }
        })
      })
    }

    setupColumns()

    assertThoughtTexts([initialThoughts, []])

    drag({
      target: () => cy.findAllByTestId("thought-card").eq(0),
      destination: () => cy.findAllByTestId("column-card").eq(1),
      offsetX: -50,
    })

    assertThoughtTexts([initialThoughts.slice(1), [initialThoughts[0]]])

    drag({
      target: () => cy.findAllByTestId("thought-card").eq(2),
      destination: () => cy.findAllByTestId("column-card").eq(0),
      offsetY: 100,
    })

    assertThoughtTexts([[...initialThoughts.slice(1), initialThoughts[0]], []])

    setupColumns()

    drag({
      target: () => cy.findAllByTestId("thought-card").eq(0),
      destination: () => cy.findAllByTestId("thought-card").eq(2),
    })

    assertThoughtTexts([
      [initialThoughts[1], initialThoughts[2], initialThoughts[0]],
      [],
    ])

    drag({
      target: () => cy.findAllByTestId("thought-card").eq(1),
      destination: () => cy.findAllByTestId("thought-card").eq(0),
    })

    assertThoughtTexts([
      [initialThoughts[2], initialThoughts[1], initialThoughts[0]],
      [],
    ])

    drag({
      target: () => cy.findAllByTestId("thought-card").eq(2),
      destination: () => cy.findAllByTestId("thought-card").eq(0),
    })

    assertThoughtTexts([
      [initialThoughts[0], initialThoughts[2], initialThoughts[1]],
      [],
    ])
  })
})

function drag({
  target,
  destination,
  offsetX = 0,
  offsetY = 0,
}: {
  target: () => Cypress.Chainable<JQuery<HTMLElement>>
  destination: () => Cypress.Chainable<JQuery<HTMLElement>>
  offsetX?: number
  offsetY?: number
}) {
  destination().then((targetElement) => {
    const clientX =
      targetElement.position().left + targetElement.width()! / 2 + offsetX
    const clientY =
      targetElement.position().top + targetElement.height()! / 2 + offsetY

    target()
      .trigger("mousedown", { button: 0 })
      .trigger("mousemove", { button: 0, clientX, clientY })
      .trigger("mousemove", { button: 0, clientX, clientY })
      .trigger("mouseup", { button: 0, clientX, clientY })
  })
}
