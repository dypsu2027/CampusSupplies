"use client";
import { useActionState, useState } from "react";
import { saveListing } from "../actions";

const CATEGORIES = ["Seating", "Tables & Desks", "Beds & Mattresses", "Storage", "Lighting", "Rugs & Textiles", "Wall Decor", "Kitchen", "Electronics", "Other"];
const CONDITIONS = ["Like new", "Good", "Fair", "Well loved"];

// Shrink photos to max 1024px JPEG so uploads stay small.
function resize(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, 1024 / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      const url = c.toDataURL("image/jpeg", 0.85);
      resolve({ url, data: url.split(",")[1], mediaType: "image/jpeg" });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export default function ListingHelper({ canUseAi, usesLeft }) {
  const [notes, setNotes] = useState("");
  const [photo, setPhoto] = useState(null);
  const [busy, setBusy] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [draft, setDraft] = useState(null);
  const [state, formAction, saving] = useActionState(saveListing, null);

  async function onPhoto(e) {
    const f = e.target.files?.[0];
    setPhoto(f ? await resize(f) : null);
  }

  async function generate() {
    setBusy(true); setAiError(null);
    try {
      const res = await fetch("/api/ai/listing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes, image: photo && { data: photo.data, mediaType: photo.mediaType } }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error);
      setDraft(body.listing);
    } catch (err) {
      setAiError(err.message || "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="two-col">
      <div className="panel">
        <span className="label">Step 1 · AI listing helper</span>
        <h3>Snap it, describe it, we'll write it</h3>
        <label className="stack" style={{ gap: "0.35rem" }}>
          Photo (optional)
          <input id="photo" type="file" accept="image/*" onChange={onPhoto} />
        </label>
        {photo && <img className="preview" src={photo.url} alt="Your item" />}
        <label className="stack" style={{ gap: "0.35rem" }}>
          A few words about it
          <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)}
            placeholder="IKEA Malm 6-drawer dresser, white, one drawer sticks a little, bought 2 years ago" />
        </label>
        {aiError && <p className="error" role="alert">{aiError}</p>}
        <button className="btn" onClick={generate} disabled={busy || !canUseAi || (!notes.trim() && !photo)}>
          {busy ? "Writing your listing…" : "Write my listing"}
        </button>
        <p className="muted" style={{ fontSize: "0.9rem" }}>
          {canUseAi ? (usesLeft === null ? "Seller Pro: unlimited AI listings." : `${usesLeft} free AI listing${usesLeft === 1 ? "" : "s"} left.`)
            : "You've used your free AI listings. Upgrade to Seller Pro below for unlimited."}
        </p>
      </div>

      <form action={formAction} className="panel stack" key={draft ? JSON.stringify(draft) : "empty"}>
        <span className="label">Step 2 · Review and post</span>
        {draft && (
          <p className="muted">
            Suggested <strong>${draft.suggested_price}</strong> (range ${draft.price_low}–${draft.price_high}). {draft.price_reasoning}
          </p>
        )}
        <label>Title<input id="title" name="title" defaultValue={draft?.title ?? ""} required /></label>
        <label>Description<textarea id="description" name="description" defaultValue={draft?.description ?? ""} required /></label>
        <div className="row" style={{ alignItems: "stretch" }}>
          <label style={{ flex: "1 1 10rem" }}>Category
            <select id="category" name="category" defaultValue={draft?.category ?? "Other"}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label style={{ flex: "1 1 10rem" }}>Condition
            <select id="condition" name="condition" defaultValue={draft?.condition ?? "Good"}>
              {CONDITIONS.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label style={{ flex: "1 1 6rem" }}>Price ($)
            <input id="price" name="price" type="number" min="0" step="1" defaultValue={draft?.suggested_price ?? ""} required />
          </label>
        </div>
        <label>Pickup details<input id="pickup_note" name="pickup_note" placeholder="Near campus, available May 8–12" /></label>
        {draft?.tips?.length > 0 && (
          <ul className="muted" style={{ margin: 0, paddingLeft: "1.2rem" }}>
            {draft.tips.map((t) => <li key={t}>{t}</li>)}
          </ul>
        )}
        {state?.error && <p className="error" role="alert">{state.error}</p>}
        {state?.ok && <p className="success" role="status">{state.message}</p>}
        <button className="btn" disabled={saving}>{saving ? "Posting…" : "Post listing"}</button>
      </form>
    </div>
  );
}
