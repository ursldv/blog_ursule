<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Commentaires extends Model
{
    protected $table = 'commentaires';
    protected $fillable = [
        'content',
        'article_id',
        'author_id',
    ];

    public function article()
    {
        return $this->belongsTo(Article::class);
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
