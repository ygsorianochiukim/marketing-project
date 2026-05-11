# Domain Layer

This folder is the **domain layer** — one folder per feature, owning that feature's types, API client, and feature-specific UI. Routes under [app/](../app/) stay thin and just call into here.

## Folder shape

Every feature follows the same shape:

```
domain/<feature-name>/
├── type.ts        ← TypeScript types (your "DTOs" / "Models")
├── api.ts         ← Laravel API client (your "Services")
├── actions.ts     ← Server Actions for forms / mutations (optional)
└── components/    ← Feature-specific UI (Server or Client components)
```

Naming rule: folder is **kebab-case** (`auto-hiring`, not `autoHiring` or `auto_hiring`). Files inside are kebab-case too, with no `.component` / `.service` suffix — the folder already tells you what it is.

[auto-hiring/](./auto-hiring/) is the reference implementation. Copy its shape when adding a new feature.

## Mapping from Laravel

| Laravel concept                          | Lives here as                                  |
| ---------------------------------------- | ---------------------------------------------- |
| `App\Models\Post` / API Resource         | A `type` in `type.ts`                          |
| `App\Http\Requests\StorePostRequest`     | A `Create*Input` / `Update*Input` type         |
| `App\Services\PostService`               | Exported `async` functions in `api.ts`         |
| `PostController@index`                   | A Server Component awaiting `getPosts()`       |
| `PostController@store` (form POST)       | A Server Action in `actions.ts`                |
| Eloquent `paginate()` response           | `LaravelCollection<T>` wrapper type            |
| API Resource `{ "data": ... }` envelope  | `LaravelResource<T>` wrapper type              |

Classes, DI containers, and singletons don't carry over. TypeScript's structural types give you the safety you'd get from a Service class without the ceremony.

## How to use a feature

### Read (Server Component)

```tsx
// app/<route>/page.tsx
import { DisplayHiring } from "@/domain/auto-hiring/components/display-hiring";

export default function Page() {
  return <DisplayHiring />;
}
```

The component is `async` and awaits the api function. The Laravel API is never called from the browser.

### Mutate (Server Action)

```ts
// domain/<feature>/actions.ts
"use server";

import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { createPost } from "./api";

export async function submitPost(formData: FormData) {
  await createPost({
    title: String(formData.get("title")),
    // ...
  });

  updateTag("posts");
  redirect("/posts");
}
```

Bind it to a form:

```tsx
<form action={submitPost}>
  <input name="title" />
  <button type="submit">Create</button>
</form>
```

**`updateTag` vs `revalidateTag(tag, "max")`:**
- Use `updateTag(tag)` inside Server Actions for read-your-own-writes (user sees their change immediately).
- Use `revalidateTag(tag, "max")` inside `api.ts` for background revalidation when the caller is unknown.

## Adding a new endpoint to an existing feature

1. **Add the type** to `type.ts`.
2. **Add the fetch function** to `api.ts`, tagging the response:
   ```ts
   const res = await fetch(`${API}/posts/${id}/comments`, {
     headers: headers(),
     next: { tags: [`posts:${id}:comments`] },
   });
   ```
3. **For mutations**, call `revalidateTag(tag, "max")` (or `updateTag` from an Action) for every tag whose data changed.

## Adding a new feature

Copy the auto-hiring folder shape:

```
domain/<feature>/
├── type.ts
├── api.ts
└── components/
```

Add `actions.ts` only when you have a form / mutation. Add an `instruction.md` only if the feature has rules that don't generalize to this file.

## Conventions

- **Field casing**: snake_case in types to match Laravel (`created_at`, `employment_type`). If you want camelCase in UI, transform once at the boundary in `api.ts` — don't sprinkle conversions across components.
- **Response unwrapping**: Laravel Resources return `{ data: ... }`. Helpers handle both wrapped and unwrapped shapes; if your backend is consistent, simplify by always picking `.data`.
- **No classes**. Plain types + exported `async` functions.
- **Server-only by default**. Don't `import` `api.ts` from a Client Component. If you need browser fetches (Sanctum cookies, search-as-you-type), add a sibling `client-api.ts` with `NEXT_PUBLIC_*` URLs.
- **Errors throw**. `api.ts` throws on `!res.ok`. The nearest `error.tsx` boundary in `app/` catches them. Don't try/catch inside `api.ts`.
- **Caching**: every read tags its data; every write invalidates the matching tags. No tag = no cache = re-fetched every request.

## Auth setup

Currently API calls send no credentials. Pick one pattern and apply it in every feature's `headers()` function:

### Bearer token (simplest, server-side only)

Add to [.env.local](../.env.local) (no `NEXT_PUBLIC_` prefix — keeps the token off the browser):

```
LARAVEL_API_TOKEN=your_token_here
```

Update `headers()` in `api.ts`:

```ts
function headers(): HeadersInit {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    Authorization: `Bearer ${process.env.LARAVEL_API_TOKEN}`,
  };
}
```

### Sanctum SPA cookies (for authenticated user sessions)

Laravel side needs:
- `SANCTUM_STATEFUL_DOMAINS` including the Next dev origin
- `SESSION_DOMAIN` and CORS configured for credentialed requests

Each request needs `credentials: "include"` and a CSRF cookie pre-fetch before mutations. This forces some calls into Client Components — prefer Bearer tokens unless you specifically need per-user sessions.

## Next.js version caveats

See [../AGENTS.md](../AGENTS.md) — this Next has breaking changes from older versions. Specifically affecting this folder:

- `fetch` is **not cached by default**. Cache is opt-in via `next: { tags: [...] }` or the `"use cache"` directive.
- `revalidateTag(tag)` is **deprecated**; use `revalidateTag(tag, "max")` (stale-while-revalidate) or `updateTag(tag)` from a Server Action.
- `params` in pages is a **Promise**: `params: Promise<{ id: string }>` — must be awaited.

Before adopting any new pattern from training-data Next.js, check `node_modules/next/dist/docs/01-app/` for this version's actual reference.
