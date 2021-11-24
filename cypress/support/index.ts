import "@testing-library/cypress/add-commands"

before(() => {
  cy.exec("pnpx prisma db push")
})

beforeEach(() => {
  cy.clearCookies()
})
