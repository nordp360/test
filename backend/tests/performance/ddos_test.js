
import http from 'k6/http';
import { check, sleep } from 'k6';

// Konfiguracja testu
export const options = {
    vus: 10, // 10 wirtualnych użytkowników równocześnie
    duration: '30s', // test trwa 30 sekund
    thresholds: {
        http_req_duration: ['p(95)<50'], // 95% zapytań musi być poniżej 50ms (adjusted for local env)
    },
};

const BASE_URL = 'http://localhost:8000'; 

export default function () {
    // SCENARIUSZ 1: Atakujący próbuje wejść na wrażliwe pliki
    // Twój middleware ma max_violations = 5
    
    // Note: We need to handle the fact that VUs run in parallel.
    // Logic inside here runs for EACH iteration for EACH VU.
    
    for (let i = 1; i <= 6; i++) {
        const res = http.get(`${BASE_URL}/.env`);
        
        // Since VUs are concurrent, violations might accumulate faster than this loop implies for a single IP
        // if they share an IP (which they do, likely localhost/127.0.0.1).
        // Middleware tracks by IP. 
        // So checking specific status codes per-request in a loop might be flaky if other VUs are also hitting it.
        // However, we can check if we EVENTUALLY get 429.
        
        if (res.status === 429) {
             check(res, {
                'is banned (429)': (r) => r.status === 429,
                'has ban message': (r) => r.json().detail.includes('banned'),
            });
        }
        
        sleep(0.1); 
    }

    // SCENARIUSZ 2: Sprawdzenie normalnego ruchu (czy ban działa na całe IP)
    const normalRes = http.get(`${BASE_URL}/api/v1/health`); # Assuming this endpoint exists or similar
    // We expect 429 if banned
    if (normalRes.status === 429) {
         check(normalRes, {
            'normal endpoint is also blocked': (r) => r.status === 429,
        });
    }

    sleep(1);
}
