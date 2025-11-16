<?php

// app/Models/Comment.php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $table = 'commentaires'; // ✅ ta table existante
    public $timestamps = false; 
    protected $fillable = [
        'author_name',
        'content',
        'article_id',
    ];

    // Optionnel : relation avec Article
    public function article()
    {
        return $this->belongsTo(Article::class);
    }
}
