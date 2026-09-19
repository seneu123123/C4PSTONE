<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'booking_ref',
        'tour_package_id',
        'tour_title',
        'customer',
        'passengers',
        'travel_date',
        'num_pax',
        'total_price',
        'deposit_required',
        'booking_status',
        'payment_status',
    ];

    protected $casts = [
        'customer' => 'array',
        'passengers' => 'array',
        'travel_date' => 'date',
        'total_price' => 'decimal:2',
        'deposit_required' => 'decimal:2',
    ];

    public function invoice()
    {
        return $this->hasOne(Invoice::class);
    }

    public function hotelReservation()
    {
        return $this->hasOne(HotelReservation::class);
    }

    public function transportReservation()
    {
        return $this->hasOne(TransportReservation::class);
    }
}
