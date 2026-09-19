<!DOCTYPE html>
<html lang="en" class="h-full bg-slate-950">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Holiday Travelers Travel & Tours Inc — Tour Operations System')</title>
    
    <!-- Tailwind CSS v3 via CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              brand: {
                50: '#ecfeff',
                500: '#06b6d4',
                600: '#0891b2',
                900: '#164e63',
              }
            }
          }
        }
      }
    </script>
    
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest"></script>
    <meta name="csrf-token" content="{{ csrf_token() }}">
</head>
<body class="h-full text-slate-100 flex flex-col font-sans antialiased">

    <!-- Navbar Layout -->
    <nav class="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <!-- Brand -->
                <div class="flex items-center gap-3">
                    <div class="p-2 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl text-white">
                        <i data-lucide="compass" class="w-6 h-6"></i>
                    </div>
                    <div>
                        <span class="font-bold text-lg text-white">Holiday Travelers</span>
                        <span class="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                            Laravel + Sanctum + PostgreSQL
                        </span>
                    </div>
                </div>

                <!-- Navigation Links -->
                <div class="hidden md:flex items-center space-x-4 text-xs font-medium">
                    <a href="{{ url('/dashboard') }}" class="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800">Dashboard</a>
                    <a href="{{ url('/packages') }}" class="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800">1. Packages</a>
                    <a href="{{ url('/bookings') }}" class="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800">2. Bookings</a>
                    <a href="{{ url('/itineraries') }}" class="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800">3. Itineraries</a>
                    <a href="{{ url('/vouchers') }}" class="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800">4. Vouchers</a>
                    <a href="{{ url('/invoices') }}" class="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800">5. Billing</a>
                    <a href="{{ url('/feedback') }}" class="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800">6. CSAT Feedback</a>
                </div>

                <!-- Sanctum Auth User Pill -->
                <div class="flex items-center gap-2">
                    <div class="text-right text-xs hidden sm:block">
                        <div class="font-bold text-white">{{ Auth::user()->name ?? 'Operator Admin' }}</div>
                        <div class="text-[10px] text-cyan-400 font-mono">Sanctum Token Active</div>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <!-- Page Content View -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        @yield('content')
    </main>

    <!-- Footer -->
    <footer class="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>Holiday Travelers Travel and Tours Inc Capstone • Integrated Laravel Blade, Sanctum REST API & PostgreSQL Architecture</p>
    </footer>

    <script>
        lucide.createIcons();
    </script>
</body>
</html>
