<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TourPackage extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'code',
        'title',
        'destination',
        'category',
        'duration_days',
        'duration_nights',
        'price_per_pax',
        'max_capacity',
        'inclusions',
        'exclusions',
        'banner_url',
        'rating',
        'review_count',
        'status',
        'featured',
        'itinerary',
    ];

    protected $casts = [
        'inclusions' => 'array',
        'exclusions' => 'array',
        'itinerary' => 'array',
        'featured' => 'boolean',
        'price_per_pax' => 'decimal:2',
    ];
}
