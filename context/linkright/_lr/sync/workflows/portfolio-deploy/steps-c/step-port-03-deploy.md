# Step 03: GitHub Pages Push

**Goal:** Automate the live deployment of the career portfolio.

---


## DEPENDENCIES
- Requires: Previous step output (if sequential)
- Requires: `lr-config.yaml` session context

## 1. Build and Inject

- Use your internal **Navi** (`lr-tracker`) persona to combine JSON payloads with the HTML/CSS templates in `_lr/sync/templates/`.
- Prepare the `dist/` or equivalent static site folder.

## 2. Deployment Orchestration

- Check out the `gh-pages` branch.
- Move local artifacts to root.
- **Commit**: "Sync-Deploy: Updated Portfolio [Timestamp]".
- **Push**: `git push origin gh-pages`.

## 3. Reporting

- Provide the live portfolio URL to the user.
- Close the workflow and update session logs.

---

## NEXT ACTION

- **[S] Save & Exit**: Finalize the deployment and close.
- **[P] Previous**: back to Beyond the Papers.
- **[A] Abort**: Exit without deploying.
