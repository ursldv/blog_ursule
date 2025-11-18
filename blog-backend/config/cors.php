<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'http://localhost:3000',
        'https://blog-ursule-e2u7.vercel.app',
    ],
    'allowed_headers' => ['*'],
    'supports_credentials' => true,
];
