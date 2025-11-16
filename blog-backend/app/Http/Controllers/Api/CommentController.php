<?php

namespace App\Http\Controllers\Api;

use App\Models\Comment;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class CommentController extends Controller
{
    // 🔍 Liste tous les commentaires avec l'article associé
    public function index()
    {
        $comments = Comment::with('article')->latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'Commentaires récupérés avec succès.',
            'data' => $comments
        ], 200);
    }

    // 📝 Crée un nouveau commentaire
    public function store(Request $request)
    {
        $validated = $request->validate([
            'content' => 'required|string',
            'article_id' => 'required|exists:articles,id',
            'author_name' => 'nullable|string|max:255',
        ]);

        $comment = Comment::create($validated)->load('article');

        return response()->json([
            'success' => true,
            'message' => 'Commentaire créé avec succès.',
            'data' => $comment
        ], 201);
    }

    // 📄 Affiche un commentaire spécifique
    public function show($id)
    {
        $comment = Comment::with('article')->find($id);

        if (!$comment) {
            return response()->json([
                'success' => false,
                'message' => 'Commentaire introuvable.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Commentaire récupéré avec succès.',
            'data' => $comment
        ], 200);
    }

    // ✏️ Met à jour un commentaire
    public function update(Request $request, $id)
    {
        $comment = Comment::find($id);

        if (!$comment) {
            return response()->json([
                'success' => false,
                'message' => 'Commentaire introuvable.'
            ], 404);
        }

        $validated = $request->validate([
            'content' => 'sometimes|required|string',
            'author_name' => 'nullable|string|max:255',
        ]);

        $comment->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Commentaire mis à jour avec succès.',
            'data' => $comment
        ], 200);
    }

    // 🗑️ Supprime un commentaire
    public function destroy($id)
    {
        $comment = Comment::find($id);

        if (!$comment) {
            return response()->json([
                'success' => false,
                'message' => 'Commentaire introuvable.'
            ], 404);
        }

        $comment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Commentaire supprimé avec succès.'
        ], 200);
    }

    // 📌 Liste des commentaires d’un article spécifique
    public function byArticle($articleId)
    {
        $comments = Comment::where('article_id', $articleId)->latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'Commentaires de l’article récupérés.',
            'data' => $comments
        ], 200);
    }
}
