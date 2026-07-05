## Browser QA policy

Do not open or use the browser for visual QA after every change.

For small, targeted changes, especially copy, CSS, typography, spacing, metadata, or static HTML edits:

- make the requested change

- run only lightweight validation if appropriate

- summarize what changed

- do not launch the browser unless explicitly asked

Use browser QA only when:

- I explicitly ask for visual QA

- the change affects layout, responsive behavior, interactions, screenshots, animations, or JavaScript behavior

- you need to debug a visual issue that cannot be verified from the code

- the change is large enough that visual regression risk is meaningful

When browser QA is not performed, say:

"Browser QA skipped per project instructions."

Never spend extra time taking screenshots or checking the page visually for tiny CSS/copy-only edits unless I request it.
