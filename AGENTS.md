<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Frontend Architecture & Component Rules

## 1. NEVER Use Raw HTML Interactive Elements

- ❌ Do NOT use raw `<button>`, `<input>`, `<textarea>`, `<select>`, `<input type="checkbox">`, or `<input type="radio">`.
- ✅ ALWAYS use the design system UI primitives in `@/components/ui/` (`Button`, `Input`, `Textarea`, `Select`, `Checkbox`, `Switch`, `RadioGroup`, `Slider`, `Badge`, `Card`, `Tabs`, `Dialog`, `Drawer`, `ResponsiveModal`, etc.).

## 2. MANDATORY Form Wrappers for ALL Forms (Even Single-Field Forms)

- ❌ Never write unmanaged inputs or ad-hoc forms.
- ✅ Every form MUST use `react-hook-form` with `zod` resolver and the typed form wrappers in `@/components/forms/`:
  - `FormInput`
  - `FormPassword`
  - `FormTextarea`
  - `FormSelect`
  - `FormCheckbox`
  - `FormCheckboxGroup`
  - `FormSwitch`
  - `FormRadioGroup`
  - `FormSlider`
  - `FormDatePicker`
  - `FormTagsInput`
  - `FormFileInput`
  - `FormRating`
  - `FormColorPicker`
  - `FormOtpInput`

## 3. Responsive Modals & Drawers

- Always wrap modals/dialogs with `<ResponsiveModal>` from `@/components/ui/responsive-modal` to provide Dialog on desktop (>=768px) and swipeable Drawer on mobile.

## 4. Design System Compliance

- Adhere strictly to `DESIGN.md` (Dimension Dusk-lit Theme: `#0a0a0a` canvas, `#161616` graphite cards, `rounded-[24px]` card radii, `rounded-full` white pill CTA buttons, and hairline borders `border-[#e5e5e5]/12`).

## 5. API Client & Hooks

- Use `@/hooks/api` (`useExams`, `useCreateExam`, `useDeleteExam`, `useUsers`, `useCreateUser`, `useHealth`) or `@/lib/api` (`api.exams`, `api.users`, `fetchGraphQL`, `apiClient`) with Sonner toast feedback.
