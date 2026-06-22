// ninja-keys ships as untransformed ESM (lit) which jest cannot parse. The
// real custom element is only exercised in the browser; tests that import it
// (directly or via Main.vue -> CommandPalette.vue) just need the side-effect
// import to be a no-op.
module.exports = {}
