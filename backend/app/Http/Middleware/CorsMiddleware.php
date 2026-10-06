<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CorsMiddleware
{
    public function handle(Request $request, Closure $next): Response
    {
        $origin = $request->headers->get('Origin');

        $allowedOrigins = [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'http://localhost:3001',
            'http://127.0.0.1:3001',
            'http://127.0.0.1:8000',
        ];

        $allowOrigin = in_array($origin, $allowedOrigins) ? $origin : '';

        $response = $next($request);

        if ($allowOrigin) {
            $response->headers->set('Access-Control-Allow-Origin', $allowOrigin);
            $response->headers->set('Access-Control-Allow-Credentials', 'true');
            $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
            $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
            $response->headers->set('Access-Control-Max-Age', '1728000');
        }

        if ($request->isMethod('OPTIONS')) {
            return response('', 204)
                ->withHeaders([
                    'Access-Control-Allow-Origin' => $allowOrigin,
                    'Access-Control-Allow-Credentials' => 'true',
                    'Access-Control-Allow-Methods' => 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers' => 'Content-Type, Authorization, X-Requested-With',
                    'Access-Control-Max-Age' => '1728000',
                ]);
        }

        return $response;
    }
}
