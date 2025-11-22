# API Examples – Smart Solar Panel Cleaner

All requests are assumed to be sent to the Next.js backend (BFF) running at:

- Local: `http://localhost:3000`

---

## 1. Upload Image – `POST /api/upload`

**Request body**

```json
{
  "panel_id": "P-1",
  "image_base64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ..."
}
```

**Example curl**

```bash
curl -X POST http://localhost:3000/api/upload \
  -H "Content-Type: application/json" \
  -d '{
    "panel_id": "P-1",
    "image_base64": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQ..."
  }'
```

**Response**

```json
{
  "panel_id": "P-1",
  "image_url": "https://res.cloudinary.com/<cloud-name>/image/upload/v1234567890/smart-solar-panel-cleaner/panel_P-1_1700000000000.jpg"
}
```

---

## 2. Run Prediction – `POST /api/predict`

**Request body**

```json
{
  "panel_id": "P-1",
  "image_url": "https://res.cloudinary.com/.../panel_P-1_1700000000000.jpg"
}
```

**Example curl**

```bash
curl -X POST http://localhost:3000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "panel_id": "P-1",
    "image_url": "https://res.cloudinary.com/.../panel_P-1_1700000000000.jpg"
  }'
```

**Response (shape)**

```json
{
  "panel_id": "P-1",
  "predicted_class": "dusty",
  "confidence": 0.87,
  "scores": {
    "clean": 0.05,
    "dusty": 0.87,
    "bird_drop": 0.03,
    "damaged": 0.05
  },
  "confidence_normalized": 0.87,
  "is_suspicious": false
}
```

---

## 3. Get All Panels – `GET /api/panels`

**Example curl**

```bash
curl http://localhost:3000/api/panels
```

**Response (array of panels)**

```json
[
  {
    "panel_id": "P-1",
    "last_status": "clean",
    "last_confidence": 0.98,
    "image_url": "https://res.cloudinary.com/.../panel_P-1_thumb.jpg",
    "last_update": "2024-01-01T10:00:00Z"
  }
]
```

> Note: The backend also returns backward-compatible fields used by the UI
> (`id`, `status`, `imageUrl`, `lastChecked`, `efficiency`).

---

## 4. Get Panel History – `GET /api/panels/{id}`

**Example curl**

```bash
curl http://localhost:3000/api/panels/P-1
```

**Response (shape)**

```json
{
  "panel_id": "P-1",
  "history": [
    {
      "image_url": "https://res.cloudinary.com/.../panel_P-1_1700000000000.jpg",
      "predicted_class": "dusty",
      "confidence": 0.87,
      "timestamp": "2024-01-01T10:00:00Z"
    }
  ]
}
```

---

## 5. Submit Feedback / Correction – `PUT /api/panels/{id}`

Used when a user marks a prediction as correct or incorrect.

**Example: Mark prediction as incorrect and provide corrected class**

```bash
curl -X PUT http://localhost:3000/api/panels/P-1 \
  -H "Content-Type: application/json" \
  -d '{
    "feedback": {
      "is_correct": false,
      "predicted_class": "dusty",
      "corrected_class": "clean",
      "confidence": 0.87,
      "timestamp": "2024-01-01T10:00:00Z"
    }
  }'
```

The Next.js API forwards this payload to the FastAPI backend (`/feedback` and
`/panels/{id}`) for storage and potential retraining.

