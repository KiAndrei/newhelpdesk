<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Validation\Rule;

class TicketController extends Controller
{
    /** GET /api/tickets */
    public function index(): JsonResponse
    {
        $tickets = Ticket::query()->orderByDesc('id')->get();

        return response()->json(['data' => $tickets], 200);
    }

    /** POST /api/tickets */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate($this->rules());

        $ticket = Ticket::create($validated);

        return response()->json([
            'message' => 'Ticket created successfully.',
            'data' => $ticket->fresh(),
        ], 201);
    }

    /** GET /api/tickets/{id} */
    public function show(string $id): JsonResponse
    {
        $ticket = Ticket::findOrFail($id);

        return response()->json(['data' => $ticket], 200);
    }

    /** PUT|PATCH /api/tickets/{id} */
    public function update(Request $request, string $id): JsonResponse
    {
        $ticket = Ticket::findOrFail($id);

        $validated = $request->validate($this->rules(partial: $request->isMethod('PATCH')));

        $ticket->update($validated);

        return response()->json([
            'message' => 'Ticket updated successfully.',
            'data' => $ticket->fresh(),
        ], 200);
    }

    /** DELETE /api/tickets/{id} -> 204 No Content */
    public function destroy(string $id): Response
    {
        $ticket = Ticket::findOrFail($id);
        $ticket->delete();

        return response()->noContent();
    }

    private function rules(bool $partial = false): array
    {
        $required = $partial ? ['sometimes', 'required'] : ['required'];

        return [
            'requester_name' => [...$required, 'string', 'max:255'],
            'requester_email' => [...$required, 'string', 'email', 'max:255'],
            'issue_category' => [...$required, 'string', Rule::in(Ticket::CATEGORIES)],
            'priority' => [...$required, 'string', Rule::in(Ticket::PRIORITIES)],
            'subject' => [...$required, 'string', 'max:255'],
            'description' => [...$required, 'string', 'max:10000'],
            'status' => ['sometimes', 'required', 'string', Rule::in(Ticket::STATUSES)],
        ];
    }
}
