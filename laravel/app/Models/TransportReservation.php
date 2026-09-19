<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransportReservation extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'booking_id',
        'vehicle_type',
        'voucher_code',
        'status',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
}
