<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Commentaires; // ✅ importer le bon modèle

class Article extends Model
{
    protected $fillable = [
        'title',
        'content',
        'image',
        'category_id',
        'author_id',
        'published_at'
    ];

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function commentaires() // ✅ nom de la relation mis à jour
    {
        return $this->hasMany(Commentaires::class); // ✅ modèle corrigé
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
