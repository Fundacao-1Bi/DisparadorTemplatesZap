# Dependency update cadence

Dependabot checks npm on Mondays at 12:45 America/Sao_Paulo, targeting develop. The configuration remains on the default main branch for Dependabot to read it. Disparador configuration changes are propagated selectively to develop.

Existing npm development minor/patch and production patch groups are preserved. GitHub Actions updater coverage and existing concurrency remain unchanged. The legacy reviewers assignment field is removed for configuration compatibility; review gates remain unchanged.

CI preserves installation, lint, existing tests when configured, and the TypeScript/Vite build. The existing 20 minute timeout is preserved.

Scheduling spreads update checks across repositories and does not itself prove fewer billed minutes. Compare at least two natural cycles: PR/run counts, retries, queue time and native duration per delivered dependency set. Include implementation and recovery work. These repositories use GitHub hosted ubuntu-latest CI; do not attribute their durations to CodeBuild or treat them as invoice savings.
