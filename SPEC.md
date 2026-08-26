# Support & Self-Service Center Spec

## Problem

Support volume grows with the platform. The expensive part isn't working on the solution, it's asking for the same information over and over: "What's your order number?", "Which shop did you buy from?", "Which email did you use?" Every round trip costs latency and a context switch on both sides.

On top of that, most requests aren't complex problems. They're a single deterministic action — resend the ticket, fix a typo in the email address, download the receipt. Things that don't need a human, just a button.

## Goal

Solve the problem before it reaches an agent's inbox. And if it can't be solved in the flow — because it's genuinely complex — collect all relevant data along the way and attach it to the support case.

Metric: share of sessions that end without a support case being created.

MVP focuses on customers: higher volume, clearer cases. Provider flows are stubbed.

## Principle

A three-step funnel. Each step resolves a share of the requests and saves human intervention at a different stage. Only if all three fail does the request get packaged and handed to an agent.

1. **Search** — an article answers the question, grouped by topic
2. **Self-service** — diagnosis and actions that fix the problem interactively
3. **Escalation** — support case with full context

Two decisions:

- **No login.** Order number + email is the authentication, like in airline apps. A customer who didn't receive their ticket is already frustrated, and a signup wall in front of the fix makes it worse. They'd go straight to support instead, which is exactly what we want to prevent.
- **Free text is the last resort.** A text field at the start turns every request into a ticket and makes a deterministic flow impossible.

---

## MVP

### 1 — Home page

- Title
- Persona picker (customer / provider)
- Search bar
- 6 top questions as shortcuts
- Incident banner for known platform-wide issues

Topics are phrased as questions the user would actually ask, not as categories. "I didn't receive my ticket", not "Ticket delivery".

**Search logic:** normalize the query, drop stop words, match the remaining tokens against title and body of each article, rank by number of matches.

No result → link to "Find booking" instead of a dead end.

**Done when:** the user opens an article with information or actions for the topic they picked, or moves on to "Find booking".

### 2 — Find booking

Order number + email. No login, no signup.

Wrong combination → one generic error ("no booking found for this combination"), no hint which of the two was wrong. Rate-limited per IP and per order number.

**Done when:** the combination matches and the user lands on the booking page.

### 2.1 — Booking page

1. **Header** — shop, product, event date, price
2. **Diagnosis** — what the system knows about this order, derived from the event log
3. **Actions** — the actions that fit the diagnosis
4. **Timeline** — full order history with timestamps, the diagnosed issue highlighted
5. **Contact** — support agent as the last resort

Diagnosis is deterministic: a small rule set maps the event log to a status, and the status decides which actions are offered.

**Done when:** the user solved their problem, or moves on to the contact form, which creates a support case with all data attached.

### 2.2 — Self-service actions

| Action | What happens |
| --- | --- |
| Resend tickets | Sends the PDFs to the email on file, logs an event |
| Correct email | Verification link to the new address, delivery only after confirmation, logs an event |
| Download tickets / receipt | Serves the PDF directly |
| Refund | Creates a case of category `cancellation` and hands it to the provider to decide |

Every action writes to the event log, and the timeline re-renders with the new entry.

**Done when:** an action ran, the new event is rendered in the timeline, and the user got a success notification.

**On "correct email":** order number + email is enough to *read* a booking, but changing the delivery address is a takeover vector. So the new address has to confirm before it receives anything, and the old address gets notified about the change.

### 3 — Escalation: support case with context

Form: free text, optional attachment.

Bundled automatically: order number, shop, payment status, mail log, device, last 5 events.

**Done when:** a case created from the booking page contains enough context for an agent to reply without querying any data.

---

## Out of scope (MVP)

- Provider self-service
- LLMs, Live chat and chatbot
- Accounts, login, order history
- Instant refunds without a provider decision
- i18n