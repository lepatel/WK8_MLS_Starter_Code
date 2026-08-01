import { http, HttpResponse } from 'msw';
import { mockThread, mockThread2, mockComment } from './data.js';

const BASE_URL = 'http://localhost:3000/api';

export const handlers = [
  // ── Threads ──────────────────────────────────────────────────────────────
  http.get(`${BASE_URL}/threads`, () =>
    HttpResponse.json({ success: true, data: [mockThread, mockThread2] })
  ),

  http.get(`${BASE_URL}/threads/:id`, ({ params }) => {
    if (params.id === 'not-found') {
      return HttpResponse.json(
        { success: false, message: 'Thread not found' },
        { status: 404 }
      );
    }
    return HttpResponse.json({ success: true, data: mockThread });
  }),

  http.post(`${BASE_URL}/threads`, async ({ request }) => {
    const body = await request.json();
    const newThread = {
      ...mockThread,
      _id: 'thread-new',
      title: body.title,
      content: body.content,
    };
    return HttpResponse.json({ success: true, data: newThread }, { status: 201 });
  }),

  http.post(`${BASE_URL}/threads/:id/upvote`, () =>
    HttpResponse.json({ success: true, data: { ...mockThread, voteCount: 4, upvotes: 6 } })
  ),

  http.post(`${BASE_URL}/threads/:id/downvote`, () =>
    HttpResponse.json({ success: true, data: { ...mockThread, voteCount: 2, downvotes: 3 } })
  ),

  // ── Comments ─────────────────────────────────────────────────────────────
  http.get(`${BASE_URL}/comments/thread/:threadId`, () =>
    HttpResponse.json({ success: true, data: [mockComment] })
  ),

  http.post(`${BASE_URL}/comments`, async ({ request }) => {
    const body = await request.json();
    const newComment = {
      ...mockComment,
      _id: 'comment-new',
      content: body.content,
    };
    return HttpResponse.json({ success: true, data: newComment }, { status: 201 });
  }),

  http.post(`${BASE_URL}/comments/:id/upvote`, () =>
    HttpResponse.json({ success: true, data: { ...mockComment, voteCount: 1 } })
  ),

  http.post(`${BASE_URL}/comments/:id/downvote`, () =>
    HttpResponse.json({ success: true, data: { ...mockComment, voteCount: -1 } })
  ),
];
