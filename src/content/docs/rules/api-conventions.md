---
title: API conventions
description: A rule file template for how your APIs are designed, covering URLs, request and response shapes, errors, authentication, pagination and documentation.
section: rules
order: 2
sources:
  - label: Path-specific rules
    url: https://code.claude.com/docs/en/memory
lastVerified: 2026-09-23
---

Consistent APIs are easier to use and maintain. An API conventions file tells Claude exactly how endpoints in your project are named, shaped and documented, so a new endpoint looks like the ones already there.

## When to use it

- Your project exposes an HTTP API, whether REST, RPC-style or a backend-for-frontend.
- You have conventions for naming, error formats or pagination that a newcomer would not guess.
- New endpoints keep coming back from review with inconsistent shapes.

## Where to save it

Save it as `.claude/rules/api-conventions.md`, scoped with `paths` to your API code, for example `src/api/**`, `app/api/**` or `routes/**`.

## What to include

- **URL design:** naming style, pluralisation and versioning.
- **Requests and responses:** content type, field naming and response shape.
- **Errors:** the error format and which status codes to use.
- **Authentication and authorisation:** how requests are authenticated and where checks happen.
- **Pagination, filtering and sorting.**
- **Validation:** how and where input is validated.
- **Documentation:** where the API is documented and what must be updated.

## Template

```markdown
---
paths:
  - "<path to API code, e.g. src/api/**>"
---

# API conventions

Follow these rules when adding or changing API endpoints.

## URLs

- <Naming style, e.g. plural nouns in kebab-case: /order-items>
- <Versioning, e.g. prefix every route with /v1>
- <Nesting rule, e.g. at most one level: /orders/{id}/items>

## Requests and responses

- Content type: <e.g. JSON only>
- Field names: <e.g. camelCase>
- <Response shape, e.g. return the resource directly, no wrapper object>
- <Date and ID formats>

## Errors

- Error format: <shape, e.g. { "error": { "code": "...", "message": "..." } }>
- <Status code rules, e.g. 400 validation, 401 not signed in, 403 not allowed, 404 missing, 409 conflict>
- <What must never appear in an error, e.g. stack traces>

## Authentication

- <How requests are authenticated>
- <Where authorisation checks happen>

## Pagination

- <Style, e.g. cursor-based with ?cursor= and ?limit=>
- <Default and maximum page size>

## Validation

- <How input is validated, e.g. a schema for every request body>

## Documentation

- <Where the API is documented and what to update with each change>

## Never

- <Rule>
```

## Example

A filled-in file for a JSON REST API written in TypeScript:

```markdown
---
paths:
  - "src/api/**"
---

# API conventions

Follow these rules when adding or changing API endpoints.

## URLs

- Plural nouns in kebab-case: `/v1/order-items`
- Prefix every route with `/v1`
- Nest at most one level: `/v1/orders/{orderId}/items`

## Requests and responses

- JSON only, with camelCase field names
- Return the resource directly; lists return `{ "data": [...], "nextCursor": "..." }`
- Dates are ISO 8601 strings in UTC; IDs are strings

## Errors

- Format: `{ "error": { "code": "ORDER_NOT_FOUND", "message": "Order not found" } }`
- 400 invalid input, 401 not signed in, 403 not allowed, 404 not found, 409 conflict
- Never include stack traces or database errors in responses

## Authentication

- Every route except `/v1/health` requires a bearer token
- Check permissions in the route handler using `requirePermission()`

## Pagination

- Cursor-based: `?cursor=` and `?limit=` (default 20, maximum 100)

## Validation

- Validate every request body and query string with a Zod schema in `src/api/schemas/`

## Documentation

- Update `openapi.yaml` in the same change as the endpoint

## Never

- Never break an existing `/v1` response shape; add a new field or version instead
```

## Tips

- **Show the exact error shape.** A literal example prevents small variations that break clients.
- **Name the helpers.** If you have a validation or auth helper, say so, or Claude may write its own.
- **Cover change safety.** Say how breaking changes are handled, so Claude does not quietly change a response.
- **Keep status codes to the ones you use.** A short, specific list beats the full HTTP specification.
