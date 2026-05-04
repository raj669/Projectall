// ─── Known Unsplash photo content classifications ─────────────────────────────
// Extracted from property image URLs: photo-{id}?w=...
// These are the actual photos used in demo properties — allows heuristic matching
// without making network requests.
const PHOTO_CATALOG = {
  // Apartments / Interiors
  '1545324418-cc1a3fa10c00': { type: 'apartment', scene: 'interior', quality: 90, desc: 'Modern apartment living area' },
  '1502672260266-1c1ef2d93688': { type: 'apartment', scene: 'interior', quality: 85, desc: 'Bright apartment interior' },
  '1460317442991-0ec209397118': { type: 'apartment', scene: 'interior', quality: 82, desc: 'Contemporary apartment room' },
  '1560448204-e02f11c3d0e2': { type: 'apartment', scene: 'interior', quality: 88, desc: 'Modern apartment dining space' },
  '1536376072261-38c75010e6c9': { type: 'apartment', scene: 'interior', quality: 80, desc: 'Compact apartment space' },
  '1493809842364-78817add7ffb': { type: 'apartment', scene: 'interior', quality: 78, desc: 'Studio/small apartment' },
  '1600566753086-00f18fb6b3ea': { type: 'apartment', scene: 'interior', quality: 95, desc: 'Luxury penthouse interior' },
  '1522708323590-d24dbb6b0267': { type: 'apartment', scene: 'interior', quality: 79, desc: 'Studio apartment' },

  // Houses
  '1568605114967-8130f3a36994': { type: 'house', scene: 'exterior', quality: 90, desc: 'Residential house exterior' },
  '1570129477492-45c003edd2be': { type: 'house', scene: 'exterior', quality: 88, desc: 'Modern house exterior' },
  '1449844908441-8829872d2607': { type: 'house', scene: 'exterior', quality: 85, desc: 'House with garden' },
  '1600585154340-be6161a56a0c': { type: 'house', scene: 'exterior', quality: 87, desc: 'Suburban house facade' },
  '1523217582562-09d8def8a6be': { type: 'house', scene: 'exterior', quality: 84, desc: 'Modern residential exterior' },
  '1502005229762-cf1b2da7c5d6': { type: 'house', scene: 'exterior', quality: 83, desc: 'Classic house exterior' },

  // Villas / Luxury residences
  '1564013799919-ab600027ffc6': { type: 'villa', scene: 'exterior', quality: 93, desc: 'Luxury villa with pool' },
  '1512917774080-9991f1c4c750': { type: 'villa', scene: 'exterior', quality: 91, desc: 'Contemporary luxury home exterior' },
  '1416331108676-a22ccb276e35': { type: 'villa', scene: 'exterior', quality: 89, desc: 'Elegant villa with landscaped garden' },
  '1600607687939-ce8a6c25118c': { type: 'villa', scene: 'exterior', quality: 94, desc: 'Premium villa exterior' },

  // Land / Open terrain
  '1500382017468-9049fed747ef': { type: 'land', scene: 'outdoor', quality: 85, desc: 'Green landscape / rural land' },
  '1464082354059-27db6ce50048': { type: 'land', scene: 'outdoor', quality: 83, desc: 'Open terrain / field' },
  '1500530855697-b586d89ba3ee': { type: 'land', scene: 'outdoor', quality: 82, desc: 'Countryside land plot' },
  '1441974231531-c6227db76b6e': { type: 'land', scene: 'outdoor', quality: 80, desc: 'Meadow and nature area' },

  // Commercial spaces
  '1497366216548-37526070297c': { type: 'commercial', scene: 'interior', quality: 87, desc: 'Office / commercial interior' },
  '1486325212027-8081e485255e': { type: 'commercial', scene: 'exterior', quality: 85, desc: 'Commercial building exterior' },
  '1497366811353-6870744d04b2': { type: 'commercial', scene: 'interior', quality: 84, desc: 'Modern office workspace' },
  '1504384308090-c894fdcc538d': { type: 'commercial', scene: 'interior', quality: 83, desc: 'Warehouse / industrial space' },
  '1497366754035-f200968a6ec5': { type: 'commercial', scene: 'interior', quality: 86, desc: 'Corporate office space' },
  '1431540015346-d30c1e1d1562': { type: 'commercial', scene: 'interior', quality: 85, desc: 'Retail / commercial space' },
};

// Which image types are acceptable for each property type
const TYPE_COMPAT = {
  apartment:  new Set(['apartment']),
  house:      new Set(['house', 'villa']),
  villa:      new Set(['villa', 'house']),
  land:       new Set(['land']),
  commercial: new Set(['commercial']),
};

// ─── Utilities ────────────────────────────────────────────────────────────────

function extractPhotoId(url) {
  const m = url.match(/photo-([\w-]+)/);
  return m ? m[1] : null;
}

function lookupPhoto(url) {
  const id = extractPhotoId(url);
  return id ? (PHOTO_CATALOG[id] ?? null) : null;
}

// ─── Build a global duplicate index across all properties ────────────────────

export function buildDuplicateIndex(properties) {
  // url → Set<propertyId>
  const index = new Map();
  for (const p of properties) {
    for (const url of (p.images || [])) {
      if (!index.has(url)) index.set(url, new Set());
      index.get(url).add(p.id);
    }
  }
  return index;
}

// ─── Per-image scoring ────────────────────────────────────────────────────────

function scoreImage(url, property, isCover, duplicateIndex) {
  const catalog  = lookupPhoto(url);
  const issues   = [];
  let score      = 70; // default baseline for unknown images

  // 1. Known photo analysis
  if (catalog) {
    score = catalog.quality;

    const compat = TYPE_COMPAT[property.type];
    if (compat && !compat.has(catalog.type)) {
      score -= 35;
      issues.push(
        `Image shows ${catalog.desc.toLowerCase()} — expected visual content for a ${property.type} listing`
      );
    }
  }

  // 2. Cross-property duplicate
  const sharedWith = duplicateIndex
    ? [...(duplicateIndex.get(url) ?? [])].filter(id => id !== property.id)
    : [];
  if (sharedWith.length > 0) {
    score -= 20;
    issues.push(`Same image used in ${sharedWith.length} other listing(s) — likely stock photo reuse`);
  }

  // 3. Cover image must be most representative
  if (isCover) {
    const compat = TYPE_COMPAT[property.type];
    if (catalog && compat && !compat.has(catalog.type)) {
      issues.push('Cover image does not represent this property type — reorder or replace');
    }
  }

  // 4. Resolution quality from URL params
  const resMatch = url.match(/[?&]w=(\d+)/);
  const width = resMatch ? parseInt(resMatch[1]) : 0;
  if (width > 0 && width < 400) {
    score -= 15;
    issues.push('Image resolution appears low — use higher quality (w≥800)');
  }

  score = Math.max(0, Math.min(100, score));

  const detected = catalog?.desc ?? 'Image content unknown';
  let recommendation = 'keep';
  if (score < 30) recommendation = 'remove';
  else if (isCover && issues.some(i => i.includes('Cover image'))) recommendation = 'reorder';

  return { score, detected, issues, recommendation };
}

// ─── Heuristic validation (no API needed) ────────────────────────────────────

export function validatePropertyHeuristic(property, allProperties = []) {
  const images        = property.images || [];
  const dupIndex      = buildDuplicateIndex(allProperties.length > 0 ? allProperties : [property]);
  const propertyIssues = [];
  let score           = 100;

  // Image count check
  if (images.length === 0) {
    propertyIssues.push('No images provided — listing cannot be shown without images');
    score -= 40;
  } else if (images.length === 1) {
    propertyIssues.push('Only one image — add at least 3 images for better engagement');
    score -= 12;
  } else if (images.length === 2 && property.price > 10_000_000) {
    propertyIssues.push('High-value listing should have at least 3 images');
    score -= 8;
  }

  // Internal duplicate detection (same URL used twice within the property)
  const seenUrls = new Set();
  const internalDups = [];
  for (const url of images) {
    if (seenUrls.has(url)) internalDups.push(url);
    seenUrls.add(url);
  }
  if (internalDups.length > 0) {
    propertyIssues.push(`${internalDups.length} duplicate image(s) within this listing`);
    score -= 15;
  }

  // Per-image analysis
  const imageResults = images.map((url, i) => {
    const r = scoreImage(url, property, i === 0, dupIndex);
    return { url, index: i, isCover: i === 0, ...r };
  });

  // Aggregate image-level issues into property score
  const flaggedImages = imageResults.filter(r => r.score < 60);
  if (flaggedImages.length > 0) {
    score -= flaggedImages.length * 8;
    if (flaggedImages.some(r => r.isCover)) {
      propertyIssues.push('Cover image may not best represent this property type');
    }
    const sharedCount = flaggedImages.filter(r => r.issues.some(i => i.includes('other listing'))).length;
    if (sharedCount > 0) {
      propertyIssues.push(`${sharedCount} image(s) shared with other listings — consider using unique photos`);
    }
  }

  // Premium listing image quality bar
  if (property.price > 20_000_000 && imageResults.every(r => r.score < 85)) {
    propertyIssues.push('Premium listing — all images should be high quality (score ≥ 85)');
    score -= 5;
  }

  score = Math.max(0, Math.min(100, score));

  const status = score >= 85 && propertyIssues.length === 0
    ? 'valid'
    : score >= 60
      ? 'flagged'
      : 'critical';

  const suggestions = buildSuggestions(property, imageResults, propertyIssues);

  return {
    propertyId:   property.id,
    propertyTitle: property.title,
    validatedAt:  new Date().toISOString(),
    method:       'heuristic',
    status,
    overallScore: score,
    images:       imageResults,
    issues:       propertyIssues,
    suggestions,
    adminNote:    '',
    adminAction:  null,
    aiEnhanced:   false,
  };
}

function buildSuggestions(property, imageResults, issues) {
  const s = [];
  const lowScoreImages = imageResults.filter(r => r.score < 50);
  if (lowScoreImages.length > 0) s.push(`Remove ${lowScoreImages.length} low-scoring image(s)`);

  const bestCover = [...imageResults].sort((a, b) => b.score - a.score)[0];
  if (bestCover && bestCover.index !== 0) {
    s.push(`Reorder images — image #${bestCover.index + 1} has the highest score and should be the cover`);
  }

  if (issues.some(i => i.includes('duplicate'))) {
    s.push('Replace shared/duplicate images with unique property photos');
  }

  if (imageResults.length < 3) {
    const needed = 3 - imageResults.length;
    s.push(`Add ${needed} more image(s) to reach the recommended minimum of 3`);
  }

  return s;
}

// ─── Apply auto-fix (returns updated images array) ───────────────────────────

export function computeAutoFix(property, result) {
  let images = [...(property.images || [])];

  // 1. Remove internal duplicates
  images = [...new Set(images)];

  // 2. Remove critically low-scoring images if ≥2 remain
  const scoreMap = new Map(result.images.map(r => [r.url, r.score]));
  const filtered = images.filter(url => (scoreMap.get(url) ?? 70) >= 35);
  if (filtered.length >= 2) images = filtered;

  // 3. Sort by score descending (best cover first)
  images.sort((a, b) => (scoreMap.get(b) ?? 70) - (scoreMap.get(a) ?? 70));

  return images;
}

// ─── Claude AI validation ─────────────────────────────────────────────────────
// Sends each image to Claude claude-haiku for visual analysis.
// Requires VITE_ANTHROPIC_API_KEY to be set.

async function analyzeOneImageWithClaude(url, property, apiKey) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 256,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'url', url },
          },
          {
            type: 'text',
            text: `You are a real estate image validator. Analyze this image for a property listing.
Property type: ${property.type}
Transaction: ${property.status === 'sale' ? 'For Sale' : 'For Rent'}
Title: "${property.title}"
Price: NPR ${property.price?.toLocaleString()}

Does this image accurately represent this property type? Check for:
- Visual content vs property type match
- Image quality and clarity
- Whether it would make a good cover photo
- Any concerning issues (wrong property type, stock-photo feel, watermarks)

Respond with ONLY this JSON, no other text:
{"score":0-100,"detected":"brief 1-sentence description of what you see","match":true,"issues":[],"recommendation":"keep|remove|cover","caption":"short auto-generated caption for this image"}`,
          },
        ],
      }],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Claude API ${res.status}: ${err.slice(0, 100)}`);
  }

  const data = await res.json();
  const text = data.content?.[0]?.text ?? '{}';

  // Strip any markdown code fences Claude might add
  const jsonText = text.replace(/```json?\n?|```/g, '').trim();
  return JSON.parse(jsonText);
}

export async function validatePropertyWithAI(property, allProperties = []) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('VITE_ANTHROPIC_API_KEY is not configured');

  const images     = property.images || [];
  const dupIndex   = buildDuplicateIndex(allProperties.length > 0 ? allProperties : [property]);
  const base       = validatePropertyHeuristic(property, allProperties);

  // Merge heuristic base with AI results per image
  const aiImageResults = [];

  for (let i = 0; i < images.length; i++) {
    const url = images[i];
    const heuristic = base.images[i];

    let aiResult = null;
    try {
      aiResult = await analyzeOneImageWithClaude(url, property, apiKey);
    } catch (e) {
      console.warn(`Claude analysis failed for image ${i} of ${property.id}:`, e.message);
    }

    if (aiResult) {
      // Blend AI score (70%) with heuristic (30%)
      const blendedScore = Math.round(aiResult.score * 0.7 + heuristic.score * 0.3);
      const allIssues = [...new Set([...(heuristic.issues ?? []), ...(aiResult.issues ?? [])])];
      aiImageResults.push({
        ...heuristic,
        score:          blendedScore,
        detected:       aiResult.detected ?? heuristic.detected,
        caption:        aiResult.caption ?? '',
        issues:         allIssues,
        recommendation: aiResult.recommendation ?? heuristic.recommendation,
        aiAnalyzed:     true,
      });
    } else {
      aiImageResults.push({ ...heuristic, aiAnalyzed: false });
    }
  }

  const overallScore = aiImageResults.length
    ? Math.round(aiImageResults.reduce((s, r) => s + r.score, 0) / aiImageResults.length)
    : 0;

  const flagged = aiImageResults.filter(r => r.score < 60);
  const aiIssues = [
    ...base.issues,
    ...flagged.flatMap(r => r.issues),
  ];
  const uniqueIssues = [...new Set(aiIssues)];

  const status = overallScore >= 85 && uniqueIssues.length === 0
    ? 'valid'
    : overallScore >= 60
      ? 'flagged'
      : 'critical';

  return {
    ...base,
    method:       'ai',
    overallScore,
    images:       aiImageResults,
    issues:       uniqueIssues,
    suggestions:  buildSuggestions(property, aiImageResults, uniqueIssues),
    status,
    aiEnhanced:   true,
    validatedAt:  new Date().toISOString(),
  };
}

// ─── Batch validation ─────────────────────────────────────────────────────────

export async function validateAllHeuristic(properties) {
  return properties.map(p => validatePropertyHeuristic(p, properties));
}

export async function validateAllWithAI(properties, onProgress) {
  const results = [];
  for (let i = 0; i < properties.length; i++) {
    const p = properties[i];
    onProgress?.({ current: i + 1, total: properties.length, propertyTitle: p.title });
    try {
      const r = await validatePropertyWithAI(p, properties);
      results.push(r);
    } catch {
      // Fall back to heuristic for this property
      results.push(validatePropertyHeuristic(p, properties));
    }
  }
  return results;
}
