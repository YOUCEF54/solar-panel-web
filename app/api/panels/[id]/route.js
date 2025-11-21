import { NextResponse } from 'next/server'
import { callFastAPI, submitFeedback } from '@/lib/fastapi'

// Fallback mock detail used only when FastAPI is unavailable
const mockPanelDetail = {
  panel_id: 'P-1',
  history: [
    {
      image_url: 'https://via.placeholder.com/800x600?text=Panel+P-1',
      predicted_class: 'Dusty',
      confidence: 97.2,
      timestamp: new Date().toISOString(),
    },
  ],
}

// GET /api/panels/[id]
export async function GET(_request, { params }) {
  try {
    const { id } = params
    const panel = await callFastAPI(`/panels/${id}`, {}, 'GET')
    return NextResponse.json(panel)
  } catch (error) {
    console.error('Error fetching panel from FastAPI, falling back to mock data:', error)
    return NextResponse.json({ ...mockPanelDetail, panel_id: params.id })
  }
}

// PUT /api/panels/[id]
// Used for feedback/corrections or metadata updates
export async function PUT(request, { params }) {
  try {
    const { id } = params
    const payload = await request.json()

    // If this is feedback, send it to the dedicated FastAPI feedback endpoint
    if (payload.feedback) {
      await submitFeedback({ panel_id: id, ...payload.feedback })
    }

    const updated = await callFastAPI(`/panels/${id}`, payload, 'PUT')
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating panel:', error)
    return NextResponse.json(
      { error: 'Failed to update panel', details: error.message },
      { status: 500 }
    )
  }
}

// DELETE /api/panels/[id]
export async function DELETE(_request, { params }) {
  try {
    const { id } = params
    await callFastAPI(`/panels/${id}`, {}, 'DELETE')
    return NextResponse.json({ message: 'Panel deleted successfully' })
  } catch (error) {
    console.error('Error deleting panel:', error)
    return NextResponse.json(
      { error: 'Failed to delete panel', details: error.message },
      { status: 500 }
    )
  }
}

