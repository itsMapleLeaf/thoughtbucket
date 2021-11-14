// run a block, reload, then run it again
// this helps to test that certain assertions are persisted across reloads
export function runWithReload(block: () => void) {
  block()
  cy.reload()
  block()
}
