// lib/pastes.js
import { store, createPipeline } from './store';
import crypto from 'crypto';
import { getNow } from './time';

export async function createPaste({ content, ttl_seconds, max_views }) {
  // Validation should be done by caller, but we can double check or just proceed.
  const id = crypto.randomBytes(8).toString('hex');
  const now = Date.now();

  const pasteData = {
    content,
    created_at: now,
    expires_at: ttl_seconds ? now + (ttl_seconds * 1000) : null,
    max_views: max_views || null,
  };



  const pipeline = createPipeline();
  pipeline.set(`paste:${id}`, JSON.stringify(pasteData));
  pipeline.set(`paste:${id}:views`, 0);

  if (ttl_seconds) {
    pipeline.expire(`paste:${id}`, ttl_seconds);
    pipeline.expire(`paste:${id}:views`, ttl_seconds);
  }

  await pipeline.exec();
  return id;
}

export async function getPaste(id, request) {
  const key = `paste:${id}`;
  const viewsKey = `paste:${id}:views`;

  // 1. Get Data
  const dataString = await store.get(key);


  if (!dataString) return null;

  const data = JSON.parse(dataString);

  // 2. Check Expiry
  const now = getNow(request);
  if (data.expires_at && now > data.expires_at) {

    return null; // Expired
  }

  let currentViews = 0;

  // 3. Check and Increment Views
  if (data.max_views) {
    const newViews = await store.incr(viewsKey);
    currentViews = newViews;
    if (newViews > data.max_views) {
      return null; // View limit exceeded
    }
  } else {
    await store.incr(viewsKey);
  }

  return { ...data, current_views: currentViews };
}
