import { NextResponse } from 'next/server'
import { callFastAPI } from '@/lib/fastapi'

// Fallback mock data used only when FastAPI is unavailable
const mockPanels = [
  {
    panel_id: 'P-1',
    last_status: 'clean',
    last_confidence: 98.2,
    image_url: 'https://via.placeholder.com/400x300?text=Panel+P-1',
    last_update: new Date().toISOString(),
    // Backwards-compatible fields for existing UI components
    id: 'P-1',
    status: 'clean',
    imageUrl: 'https://via.placeholder.com/400x300?text=Panel+P-1',
    lastChecked: new Date().toISOString(),
    efficiency: 95,
  },
  {
    panel_id: 'P-2',
    last_status: 'dusty',
    last_confidence: 82.5,
    image_url: 'https://via.placeholder.com/400x300?text=Panel+P-2',
    last_update: new Date().toISOString(),
    id: 'P-2',
    status: 'dusty',
    imageUrl: 'https://via.placeholder.com/400x300?text=Panel+P-2',
    lastChecked: new Date().toISOString(),
    efficiency: 88,
  },
  {
    panel_id: 'P-3',
    last_status: 'damaged',
    last_confidence: 91.1,
    image_url: 'https://via.placeholder.com/400x300?text=Panel+P-3',
    last_update: new Date().toISOString(),
    id: 'P-3',
    status: 'damaged',
    imageUrl: 'https://via.placeholder.com/400x300?text=Panel+P-3',
    lastChecked: new Date().toISOString(),
    efficiency: 72,
  },
]

// Normalise panel payload so that it matches the spec
// and remains backwards-compatible with existing UI
function normalizePanel(panel) {
  const panel_id = panel.panel_id ?? panel.id
  const last_status = panel.last_status ?? panel.status
  const last_confidence = panel.last_confidence ?? panel.confidence
  const image_url = panel.image_url ?? panel.imageUrl ?? panel.image_url
  const last_update = panel.last_update ?? panel.lastChecked ?? panel.updated_at

  return {
    panel_id,
    last_status,
    last_confidence,
    image_url,
    last_update,
    // Backwards-compatible fields used by the dashboard UI
    id: panel_id,
    status: last_status,
    imageUrl: image_url,
    lastChecked: last_update,
    efficiency: panel.efficiency ?? null,
  }
}

// GET /api/panels
// Returns array of panel summaries
export async function GET() {
  try {
    const panels = await callFastAPI('/panels', {}, 'GET')
    const normalized = Array.isArray(panels) ? panels.map(normalizePanel) : []
    return NextResponse.json(normalized)
  } catch (error) {
    console.error('Error fetching panels from FastAPI, falling back to mock data:', error)
    const normalized = mockPanels.map(normalizePanel)
    return NextResponse.json(normalized)
  }
}

// POST /api/panels
// Optional: create/register a new panel via FastAPI backend
export async function POST(request) {
  try {
    const payload = await request.json()

    if (!payload.panel_id) {
      return NextResponse.json(
        { error: 'panel_id is required' },
        { status: 400 }
      )
    }

    const created = await callFastAPI('/panels', payload, 'POST')
    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error('Error creating panel:', error)
    return NextResponse.json(
      { error: 'Failed to create panel', details: error.message },
      { status: 500 }
    )
  }
}

