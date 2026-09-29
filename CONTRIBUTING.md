# Contributing

Thanks for helping! This project stays small on purpose.

## Principles

1. **Repo-first, zero dependencies.** The CLI uses only Node's standard library.
2. **Minimal footprint.** Anything installed into a user's project goes in
   `kit/` (always installed) or `kit-ci/` (installed with `--ci`).
3. **Never overwrite user files.**
4. **Templates are prompts.** Wording in `kit/` is read by AI agents, so write
   it clearly, concretely, and as briefly as possible.

## Layout

```
bin/vpos.mjs      CLI (init, feature, adr, check)
kit/              files copied into a project by `init`
kit-ci/           GitHub Action + PR template, copied with `init --ci`
examples/         real projects mapped with the kit
docs/             integrations and this repo's own ADRs
test/             node:test suite
```

## Development

```bash
npm test                 # CLI tests
npm run check:examples   # run `vpos check` on the examples
node bin/vpos.mjs init /tmp/demo && node bin/vpos.mjs check /tmp/demo
```

For a significant design change, add an ADR in `docs/decisions/`.
