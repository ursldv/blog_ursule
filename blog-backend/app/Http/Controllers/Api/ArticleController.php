<?php

namespace App\Http\Controllers\Api;

use App\Models\Article;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Carbon;

class ArticleController extends Controller
{  
    
    public function index()
    {
        $articles = Article::with('author', 'commentaires', 'category')->latest()->get();

        return response()->json([
            'success' => true,
            'message' => 'Articles retrieved successfully.',
            'data' => $articles
        ], 200);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'content' => 'required|string',
                'category_id' => 'required|exists:categories,id', // ✅ correction ici
                'author_id' => 'required|exists:users,id',
                'image' => 'nullable|image|max:2048',
            ]);

            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('articles', 'public');
                $validated['image'] = $path;
            }

            $validated['published_at'] = Carbon::now();

            $article = Article::create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Article created successfully.',
                'data' => $article
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Erreur ajout article : ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur : ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $article = Article::with('author', 'commentaires', 'category')->find($id);

        if (!$article) {
            return response()->json([
                'success' => false,
                'message' => 'Article not found.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Article retrieved successfully.',
            'data' => $article
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $article = Article::find($id);

        if (!$article) {
            return response()->json([
                'success' => false,
                'message' => 'Article not found.'
            ], 404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
            'category_id' => 'sometimes|exists:categories,id', // ✅ correction ici
            'author_id' => 'sometimes|exists:users,id',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('articles', 'public');
            $validated['image'] = $path;
        }

        $article->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Article updated successfully.',
            'data' => $article
        ], 200);
    }

    public function destroy($id)
    {
        $article = Article::find($id);

        if (!$article) {
            return response()->json([
                'success' => false,
                'message' => 'Article not found.'
            ], 404);
        }

        $article->delete();

        return response()->json([
            'success' => true,
            'message' => 'Article deleted successfully.'
        ], 200);
    }

}
