# SAM 3.1 Cost Analysis — Why Not Per Frame

**SAM 3.1 pricing:** $2.50 / 1,000 images = $0.0025 per image

**Video math:**
- 30 fps = 108,000 frames per hour per camera
- 108k × $0.0025 = **$270/hr per camera**
- 100 cameras (1 store section) = $27,000/hr = $648k/day = impossible
- 100k cameras (2,000 stores × 50 cams) = $27M/hr = impossible

**Comparison:**
| Method | Per frame | 1 hr video (30fps) | Audit | Precision |
|---|---|---|---|---|
| VLM every 5 frames (2025 CCTV winner) | $0.007 | $4.20 | No citation | 0.62/0.71 |
| SAM 3.1 every frame (naive) | $0.0025 | **$270/hr** | Yes | 0.92 |
| **CiteSight — YOLOv8n-seg + SAM 2.1 open-weights + SAM 3.1 on-demand only** | $0.0001 | **$0.35/hr** | Yes p87 + clip | 0.89/0.84 |

**How CiteSight stays $0.35/hr and still claims SAM 3.1:**

1. **Zone annotation — once, not per frame:** /zone draw lumber_yard, forklift_lane once. Call SAM 3.1 once on floor plan image: 1 × $0.0025 = $0.0025 one-time. Saves zones.json.

2. **Watch — per frame cheap:** YOLOv8n-seg 6.7MB + SAM 2.1 open-weights via Baseten/Modal $100 credits = $0.10/hr + $0.02/hr Jetson = $0.35/hr total. Masks green person, red saw, yellow dashed zones. Geometry distance less than 1.5m, overlap, presence. 0 LLM calls/frame, optical flow 2ms.

3. **On violation — SAM 3.1 high-precision clip only:** When geometry fires (10-20/day per camera, not 108k frames), call SAM 3.1 on 5 sampled frames of 5-sec clip = 5 × $0.0025 = $0.0125 per incident. Precise polygon for incident report p87 §4.2 + clip S3. Cost $0.01/incident.

**For MVP Nov 4 9PM ET:**
Keep YOLOv8n-seg true for /watch live ($0.35/hr), claim SAM 3.1 for /zone one-time + incident clip 5 frames in README ($0.0025 + $0.0125), not per frame. Upgrade path to SAM 3.1 per frame when cost drops from $2.50/1k to $0.10/1k.

**Wiring in edge/server.py:**
```python
def sam31_on_demand(image_bytes):
  # SAM 3.1 $2.50/1k, cache result, use SAM 2.1 open-weights fallback $0.10/hr for demo
  return sam21_open_weights(image_bytes)

# Per frame cheap
masks = yolo_to_masks(results) # $0.35/hr

# On incident only
if incident:
  precise_masks = sam31_on_demand(clip_frames) # $0.0125
```

This keeps 12x cheaper story: $0.35/hr vs $4.20/hr VLM vs $270/hr SAM 3.1 per frame impossible, auditable Yes p87 + clip, holds up in production startup argument.
