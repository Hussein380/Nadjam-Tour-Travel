## Session Flow Logic – Mental Health Voice Assistant

This document defines how a complete voice session works between the user, Vapi, the backend, and Gemini. It helps structure the logic inside the backend API layer and ensures correct coordination of steps.

---

### 🧠 Goal

To conduct a dynamic, compassionate mental health check-in with a user by:

* Asking open-ended questions
* Adapting to user input
* Providing emotional validation
* Summarizing insights

---

### 📞 Full Session Lifecycle

#### 1. Session Start

* Triggered by call from user (via Vapi)
* Vapi calls `/api/sessions/initiate`
* Backend:

  * Creates new session document in Firestore
  * Stores `userId`, `timestamp`, and `callMetadata`

---

#### 2. Opening Message

* Vapi uses a `Say` block:

> “Hi, I’m here to talk with you and support your mental health. Would you like to begin?”

---

#### 3. Free-Form User Input

* Vapi uses a `Gather` block
* Captures first message from user

---

#### 4. Dynamic Question Loop

Each loop cycle includes:

**Step A: User Speaks**  → Vapi transcribes and POSTs to `/api/sessions/respond`

**Step B: Backend**

* Adds user message to session history
* Calls Gemini with:

```json
{
  "history": [...],
  "newInput": "I'm feeling anxious most days"
}
```

* Gemini returns next therapist-style message

**Step C: Vapi Speaks Reply**

* Returned Gemini text is spoken via `Say` node

➡ This loop continues 4–6 times or until Gemini recommends ending.

---

#### 5. Optional Screening

* Gemini may trigger PHQ-9 or GAD-7 assessments based on emotional context
* Vapi gathers answers to each structured question
* Results are stored in `assessments` collection

---

#### 6. Ending the Session

* Gemini sends final message like:

> “Thank you for opening up today. I hope this helped a little. You're not alone.”

* Vapi ends the call
* Backend calls `/api/sessions/complete` with:

  * `sessionId`
  * `endTime`
  * Optional user feedback

---

#### 7. Post-Session Analysis

* Backend generates a Gemini summary using full transcript:

```json
{
  "themes": ["isolation", "anxiety"],
  "recommendations": ["deep breathing", "journaling"]
}
```

* Saved under `sessions.analysis`

---

### ✅ Summary of Flow

```
User → Vapi → Backend (initiate)
User talks → Gather → respond
Backend → Gemini → reply
Vapi speaks → loop
End → complete → summary
```
