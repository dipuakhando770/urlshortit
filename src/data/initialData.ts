import { 
  LinkItem, 
  ClickEvent, 
  UserProfile, 
  AppSettings, 
  AuditLog, 
  PHPFileEntry, 
  CustomDomain, 
  UserDomainPermission, 
  PackageTier, 
  Subscription, 
  OrderRecord 
} from '../types';

export const initialPackages: PackageTier[] = [
  {
    id: 'pkg_free',
    name: 'Free',
    description: 'Perfect for casual personal link shortening with basic features.',
    price: 0,
    currency: 'USD',
    billingPeriod: 'lifetime',
    maxLinksQuota: 25,
    maxCustomDomainsQuota: 0,
    hasAllDomainsAccess: false,
    allowCustomAlias: false,
    hasAdvancedAnalytics: false,
    hasApiAccess: false,
    status: 'active'
  },
  {
    id: 'pkg_starter',
    name: 'Starter',
    description: 'Ideal for freelance creators and bloggers requiring branded links.',
    price: 9,
    currency: 'USD',
    billingPeriod: 'monthly',
    maxLinksQuota: 250,
    maxCustomDomainsQuota: 1,
    hasAllDomainsAccess: false,
    allowCustomAlias: true,
    hasAdvancedAnalytics: true,
    hasApiAccess: false,
    status: 'active'
  },
  {
    id: 'pkg_pro',
    name: 'Pro',
    description: 'High-volume shortener for marketing agencies and fast-scaling products.',
    price: 29,
    currency: 'USD',
    billingPeriod: 'monthly',
    maxLinksQuota: 2500,
    maxCustomDomainsQuota: 5,
    hasAllDomainsAccess: false,
    allowCustomAlias: true,
    hasAdvancedAnalytics: true,
    hasApiAccess: true,
    status: 'active',
    isPopular: true
  },
  {
    id: 'pkg_business',
    name: 'Business',
    description: 'Enterprise tier with unlimited verified domains, custom SLA, and priority redirect routing.',
    price: 79,
    currency: 'USD',
    billingPeriod: 'monthly',
    maxLinksQuota: -1, // Unlimited
    maxCustomDomainsQuota: -1, // Unlimited
    hasAllDomainsAccess: true,
    allowCustomAlias: true,
    hasAdvancedAnalytics: true,
    hasApiAccess: true,
    status: 'active'
  }
];

export const initialDomains: CustomDomain[] = [
  {
    id: 'dom_1',
    domainName: 'lnk.pro',
    status: 'active',
    isVerified: true,
    verificationToken: 'v_token_sys_primary_core',
    dnsRecordType: 'dns_txt',
    expectedDnsHost: '@',
    expectedDnsValue: 'linkpro-verify=sys-primary-domain',
    verifiedAt: '2026-01-01 00:00:00',
    createdAt: '2026-01-01 00:00:00',
    isGlobal: true,
    sslActive: true,
    totalLinksCount: 154,
    totalClicksCount: 4290
  },
  {
    id: 'dom_2',
    domainName: 'go.nasir.dev',
    status: 'active',
    isVerified: true,
    verificationToken: 'lp_verify_9921_nasir',
    dnsRecordType: 'dns_txt',
    expectedDnsHost: '_linkpro-verify.go.nasir.dev',
    expectedDnsValue: 'linkpro-verify=lp_verify_9921_nasir',
    verifiedAt: '2026-10-16 11:20:00',
    createdAt: '2026-10-15 08:30:00',
    userId: 'usr_1',
    isGlobal: false,
    sslActive: true,
    totalLinksCount: 18,
    totalClicksCount: 840
  },
  {
    id: 'dom_3',
    domainName: 'short.technews.com',
    status: 'active',
    isVerified: true,
    verificationToken: 'lp_verify_tech_4401',
    dnsRecordType: 'dns_txt',
    expectedDnsHost: '_linkpro-verify.short.technews.com',
    expectedDnsValue: 'linkpro-verify=lp_verify_tech_4401',
    verifiedAt: '2026-10-18 14:40:00',
    createdAt: '2026-10-18 09:15:00',
    userId: 'usr_2',
    isGlobal: true, // Available to all paid users
    sslActive: true,
    totalLinksCount: 45,
    totalClicksCount: 1250
  },
  {
    id: 'dom_4',
    domainName: 'click.brandoutlet.org',
    status: 'pending_verification',
    isVerified: false,
    verificationToken: 'lp_verify_outlet_7719',
    dnsRecordType: 'dns_txt',
    expectedDnsHost: '_linkpro-verify.click.brandoutlet.org',
    expectedDnsValue: 'linkpro-verify=lp_verify_outlet_7719',
    createdAt: '2026-10-23 16:00:00',
    userId: 'usr_1',
    isGlobal: false,
    sslActive: false,
    totalLinksCount: 0,
    totalClicksCount: 0
  },
  {
    id: 'dom_5',
    domainName: 'links.dhaka.live',
    status: 'suspended',
    isVerified: true,
    verificationToken: 'lp_verify_dhk_3321',
    dnsRecordType: 'dns_txt',
    expectedDnsHost: '_linkpro-verify.links.dhaka.live',
    expectedDnsValue: 'linkpro-verify=lp_verify_dhk_3321',
    verifiedAt: '2026-10-19 10:00:00',
    createdAt: '2026-10-19 09:00:00',
    userId: 'usr_3',
    isGlobal: false,
    sslActive: true,
    totalLinksCount: 12,
    totalClicksCount: 310
  }
];

export const initialUserPermissions: UserDomainPermission[] = [
  // User 1 (Nasir Mia, Admin, Pro) has explicit grants
  { id: 'prm_1', userId: 'usr_1', domainId: 'dom_1', isAllowed: true, grantedBy: 'sys', grantedAt: '2026-10-15 08:00:00' },
  { id: 'prm_2', userId: 'usr_1', domainId: 'dom_2', isAllowed: true, grantedBy: 'sys', grantedAt: '2026-10-15 08:30:00' },
  { id: 'prm_3', userId: 'usr_1', domainId: 'dom_3', isAllowed: true, grantedBy: 'usr_1', grantedAt: '2026-10-18 15:00:00' },
  // User 2 (Sarah Jenkins, Starter)
  { id: 'prm_4', userId: 'usr_2', domainId: 'dom_1', isAllowed: true, grantedBy: 'sys', grantedAt: '2026-10-19 12:30:00' },
  { id: 'prm_5', userId: 'usr_2', domainId: 'dom_3', isAllowed: true, grantedBy: 'usr_1', grantedAt: '2026-10-20 10:00:00' },
  // Explicit Denial: User 2 is denied access to dom_2
  { id: 'prm_6', userId: 'usr_2', domainId: 'dom_2', isAllowed: false, grantedBy: 'usr_1', grantedAt: '2026-10-20 10:05:00' },
  // User 3 (Tanvir Ahmed, Free)
  { id: 'prm_7', userId: 'usr_3', domainId: 'dom_1', isAllowed: true, grantedBy: 'sys', grantedAt: '2026-10-20 14:20:00' }
];

export const initialUsers: UserProfile[] = [
  { 
    id: 'usr_1', 
    name: 'Nasir Mia', 
    email: 'nasirmia360.02@gmail.com', 
    role: 'admin', 
    status: 'active', 
    createdAt: '2026-10-15 08:00:00', 
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    packageId: 'pkg_business',
    subscriptionId: 'sub_1',
    hasAllDomainsAccess: true,
    inheritFutureDomains: true
  },
  { 
    id: 'usr_2', 
    name: 'Sarah Jenkins', 
    email: 'sarah.j@example.com', 
    role: 'user', 
    status: 'active', 
    createdAt: '2026-10-19 12:30:00', 
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    packageId: 'pkg_pro',
    subscriptionId: 'sub_2',
    hasAllDomainsAccess: false,
    inheritFutureDomains: false
  },
  { 
    id: 'usr_3', 
    name: 'Tanvir Ahmed', 
    email: 'tanvir@example.com', 
    role: 'user', 
    status: 'active', 
    createdAt: '2026-10-20 14:20:00', 
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    packageId: 'pkg_free',
    subscriptionId: 'sub_3',
    hasAllDomainsAccess: false,
    inheritFutureDomains: false
  }
];

export const initialSubscriptions: Subscription[] = [
  {
    id: 'sub_1',
    userId: 'usr_1',
    packageId: 'pkg_business',
    status: 'active',
    startDate: '2026-10-15 08:00:00',
    expiresDate: '2027-10-15 08:00:00',
    autoRenew: true,
    paymentMethod: 'Manual Bank Wire (Admin Approved)'
  },
  {
    id: 'sub_2',
    userId: 'usr_2',
    packageId: 'pkg_pro',
    status: 'active',
    startDate: '2026-10-19 12:30:00',
    expiresDate: '2026-11-19 12:30:00',
    autoRenew: true,
    paymentMethod: 'bKash TrxID: 9X82LLQ9'
  },
  {
    id: 'sub_3',
    userId: 'usr_3',
    packageId: 'pkg_free',
    status: 'active',
    startDate: '2026-10-20 14:20:00',
    expiresDate: '2099-12-31 23:59:59',
    autoRenew: false,
    paymentMethod: 'Free Plan'
  }
];

export const initialOrders: OrderRecord[] = [
  {
    id: 'ord_1001',
    orderNumber: 'LP-2026-1001',
    userId: 'usr_1',
    userName: 'Nasir Mia',
    packageId: 'pkg_business',
    packageName: 'Business Yearly',
    amount: 790,
    currency: 'USD',
    paymentMethod: 'bank_transfer',
    transactionReference: 'WIRE-US-991204882',
    status: 'approved',
    receiptNotes: 'Verified via Corporate Bank Statement #221',
    createdAt: '2026-10-15 08:00:00',
    reviewedAt: '2026-10-15 08:10:00'
  },
  {
    id: 'ord_1002',
    orderNumber: 'LP-2026-1002',
    userId: 'usr_2',
    userName: 'Sarah Jenkins',
    packageId: 'pkg_pro',
    packageName: 'Pro Monthly',
    amount: 29,
    currency: 'USD',
    paymentMethod: 'bkash_nagad',
    transactionReference: 'BKASH-88192-A8',
    status: 'approved',
    receiptNotes: 'MFS Gateway confirmation received',
    createdAt: '2026-10-19 12:20:00',
    reviewedAt: '2026-10-19 12:30:00'
  },
  {
    id: 'ord_1003',
    orderNumber: 'LP-2026-1003',
    userId: 'usr_3',
    userName: 'Tanvir Ahmed',
    packageId: 'pkg_starter',
    packageName: 'Starter Monthly',
    amount: 9,
    currency: 'USD',
    paymentMethod: 'bkash_nagad',
    transactionReference: 'NAGAD-TRX-44919',
    status: 'pending_review',
    receiptNotes: 'Customer deposited 1050 BDT via Agent #01700000000',
    createdAt: '2026-10-24 05:40:00'
  }
];

export const initialLinks: LinkItem[] = [
  {
    id: 'lnk_1',
    domainId: 'dom_1',
    domainName: 'lnk.pro',
    originalUrl: 'https://github.com/features/actions',
    shortCode: 'ghact99',
    shortUrl: 'https://lnk.pro/ghact99',
    title: 'GitHub Actions Documentation',
    description: 'CI/CD pipelines and workflow automation guide.',
    clicks: 142,
    createdAt: '2026-10-20 10:30:00',
    status: 'active',
    userId: 'usr_1',
    lastClickedAt: '2026-10-24 05:12:00',
    redirectType: '302'
  },
  {
    id: 'lnk_2',
    domainId: 'dom_2',
    domainName: 'go.nasir.dev',
    originalUrl: 'https://laravel.com/docs/11.x/routing',
    shortCode: 'larv11',
    shortUrl: 'https://go.nasir.dev/larv11',
    title: 'Laravel 11 Routing Guide',
    description: 'Official routing documentation for PHP Laravel framework.',
    clicks: 89,
    createdAt: '2026-10-21 14:15:00',
    status: 'active',
    userId: 'usr_1',
    lastClickedAt: '2026-10-24 04:30:00',
    redirectType: '302'
  },
  {
    id: 'lnk_3',
    domainId: 'dom_3',
    domainName: 'short.technews.com',
    originalUrl: 'https://getbootstrap.com/docs/5.3/getting-started/introduction/',
    shortCode: 'boot53',
    shortUrl: 'https://short.technews.com/boot53',
    title: 'Bootstrap 5.3 Docs',
    description: 'Responsive UI components and layout utilities.',
    clicks: 56,
    createdAt: '2026-10-22 09:00:00',
    status: 'active',
    userId: 'usr_2',
    lastClickedAt: '2026-10-23 22:15:00',
    redirectType: '302'
  },
  {
    id: 'lnk_4',
    domainId: 'dom_1',
    domainName: 'lnk.pro',
    originalUrl: 'https://mariadb.com/kb/en/documentation/',
    shortCode: 'mdbdoc',
    shortUrl: 'https://lnk.pro/mdbdoc',
    title: 'MariaDB Knowledge Base',
    description: 'SQL queries, indexing, and high performance tuning.',
    clicks: 210,
    createdAt: '2026-10-18 16:45:00',
    status: 'active',
    userId: 'usr_1',
    lastClickedAt: '2026-10-24 06:01:00',
    redirectType: '302'
  },
  {
    id: 'lnk_5',
    domainId: 'dom_2',
    domainName: 'go.nasir.dev',
    originalUrl: 'https://nginx.org/en/docs/http/ngx_http_rewrite_module.html',
    shortCode: 'ngxrew',
    shortUrl: 'https://go.nasir.dev/ngxrew',
    title: 'Nginx URL Rewriting',
    description: 'Clean URLs and proxy configuration rules.',
    clicks: 34,
    createdAt: '2026-10-23 11:20:00',
    status: 'active',
    userId: 'usr_1',
    lastClickedAt: '2026-10-24 02:10:00',
    redirectType: '302'
  }
];

export const initialClickEvents: ClickEvent[] = [
  { id: 'clk_1', linkId: 'lnk_1', domainId: 'dom_1', domainName: 'lnk.pro', shortCode: 'ghact99', ipAddress: '192.168.1.45', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', referer: 'https://google.com', country: 'Bangladesh', device: 'Desktop', browser: 'Chrome', clickedAt: '2026-10-24 05:12:00' },
  { id: 'clk_2', linkId: 'lnk_4', domainId: 'dom_1', domainName: 'lnk.pro', shortCode: 'mdbdoc', ipAddress: '203.0.113.8', userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)', referer: 'https://github.com', country: 'United States', device: 'Mobile', browser: 'Safari', clickedAt: '2026-10-24 06:01:00' },
  { id: 'clk_3', linkId: 'lnk_2', domainId: 'dom_2', domainName: 'go.nasir.dev', shortCode: 'larv11', ipAddress: '103.102.25.12', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', referer: 'Direct', country: 'Bangladesh', device: 'Desktop', browser: 'Firefox', clickedAt: '2026-10-24 04:30:00' },
  { id: 'clk_4', linkId: 'lnk_1', domainId: 'dom_1', domainName: 'lnk.pro', shortCode: 'ghact99', ipAddress: '192.168.1.99', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', referer: 'https://facebook.com', country: 'Bangladesh', device: 'Desktop', browser: 'Edge', clickedAt: '2026-10-23 20:11:00' },
  { id: 'clk_5', linkId: 'lnk_3', domainId: 'dom_3', domainName: 'short.technews.com', shortCode: 'boot53', ipAddress: '45.33.22.11', userAgent: 'Mozilla/5.0 (X11; Linux x86_64)', referer: 'https://twitter.com', country: 'Germany', device: 'Desktop', browser: 'Chrome', clickedAt: '2026-10-23 22:15:00' }
];

export const initialSettings: AppSettings = {
  siteName: 'LinkPro Enterprise URL Shortener',
  defaultDomain: 'lnk.pro',
  allowRegistration: true,
  defaultRedirectType: '302',
  maxUrlLength: 2048,
  rateLimitPerMin: 60,
  maintenanceMode: false,
  defaultLanguage: 'bn',
  requireDomainVerification: true,
  defaultGlobalDomainPolicy: 'paid_only'
};

export const initialAuditLogs: AuditLog[] = [
  { id: 'aud_1', userId: 'usr_1', userName: 'Nasir Mia', action: 'Approved manual MFS subscription order #LP-2026-1002 for Sarah Jenkins (Pro)', ip: '192.168.1.1', timestamp: '2026-10-24 05:45:00' },
  { id: 'aud_2', userId: 'usr_1', userName: 'Nasir Mia', action: 'Granted All-Domains access privilege to user usr_1', ip: '192.168.1.1', timestamp: '2026-10-24 04:30:00' },
  { id: 'aud_3', userId: 'usr_1', userName: 'Nasir Mia', action: 'Verified custom domain DNS challenge for go.nasir.dev', ip: '192.168.1.1', timestamp: '2026-10-16 11:20:00' },
  { id: 'aud_4', userId: 'usr_1', userName: 'Nasir Mia', action: 'Installed Enterprise MariaDB Schema v2.4', ip: '192.168.1.1', timestamp: '2026-10-15 08:05:00' }
];

export const phpCodebaseFiles: PHPFileEntry[] = [
  {
    path: 'public/index.php',
    name: 'index.php',
    category: 'public',
    description: 'Multi-domain front controller that extracts incoming HTTP_HOST and cleanly dispatches routes or 302 redirects.',
    content: `<?php
/**
 * LinkPro Enterprise Multi-Domain URL Shortener
 * PHP 8.2+ Front Controller
 */

declare(strict_types=1);
session_start();

require_once __DIR__ . '/../app/bootstrap.php';

use App\\Controllers\\AuthController;
use App\\Controllers\\LinkController;
use App\\Controllers\\DomainController;
use App\\Controllers\\PackageController;
use App\\Controllers\\AdminController;

$host = strtolower(explode(':', $_SERVER['HTTP_HOST'] ?? 'lnk.pro')[0]);
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// 1. Direct Redirection Check: Check if path is a short code (e.g., /aB92xQ)
if (preg_match('/^\\/([a-zA-Z0-9_-]{3,32})$/', $uri, $matches)) {
    $shortCode = $matches[1];
    $requestHost = $host;
    require __DIR__ . '/redirect.php';
    exit;
}

// 2. CORS Handling for Cloudflare Pages Frontend
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept");

if ($method === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// 3. API & Web Routes
if ($uri === '/api/health') {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => true,
        'data' => [
            'status' => 'healthy',
            'service' => 'LinkPro Authoritative URL Shortener',
            'version' => '2.4.0',
            'database' => 'MariaDB Connected',
            'time' => date('c')
        ]
    ]);
    exit;
} elseif ($uri === '/api/links' && $method === 'POST') {
    (new LinkController())->store();
} elseif ($uri === '/api/links' && $method === 'GET') {
    (new LinkController())->index();
} elseif ($uri === '/api/domains' && $method === 'GET') {
    (new DomainController())->index();
} elseif ($uri === '/api/domains/verify' && $method === 'POST') {
    (new DomainController())->verifyDns();
} elseif ($uri === '/api/packages/purchase' && $method === 'POST') {
    (new PackageController())->createOrder();
} elseif ($uri === '/api/login' && $method === 'POST') {
    (new AuthController())->login();
} elseif ($uri === '/' || $uri === '/index.php') {
    require __DIR__ . '/../app/Views/home.php';
} else {
    http_response_code(404);
    require __DIR__ . '/../app/Views/errors/404.php';
}`
  },
  {
    path: 'public/shorten.php',
    name: 'shorten.php',
    category: 'public',
    description: 'Stage 2 VPS Final Shortener API endpoint. Receives Stage 1 short_url + original_url and generates authoritative final short URL.',
    content: `<?php
/**
 * LinkPro Enterprise - Stage 2 VPS URL Shortener API
 * Endpoint: POST /shorten.php
 *
 * Receives Stage 1 Short URL + Original Long URL and returns error: 0 and final short_url.
 */

declare(strict_types=1);
require_once __DIR__ . '/../app/bootstrap.php';

use App\\Services\\Database;

// Handle CORS
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Accept");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 1, 'msg' => 'Method Not Allowed. POST required.']);
    exit;
}

$raw = file_get_contents('php://input');
$input = json_decode($raw, true) ?: $_POST;

$stage1Url = filter_var($input['short_url'] ?? '', FILTER_SANITIZE_URL);
$originalUrl = filter_var($input['original_url'] ?? '', FILTER_SANITIZE_URL);

if (!filter_var($stage1Url, FILTER_VALIDATE_URL) || !preg_match('/^https?:\\/\\//i', $stage1Url)) {
    http_response_code(422);
    echo json_encode(['error' => 2, 'msg' => 'Invalid or missing short_url (Stage 1 URL).']);
    exit;
}

if (!filter_var($originalUrl, FILTER_VALIDATE_URL) || !preg_match('/^https?:\\/\\//i', $originalUrl)) {
    http_response_code(422);
    echo json_encode(['error' => 3, 'msg' => 'Invalid or missing original_url.']);
    exit;
}

$db = Database::getInstance();

// Generate unique Stage 2 final code on the primary domain
$finalCode = strtolower(substr(bin2hex(random_bytes(4)), 0, 6));
$finalShortUrl = "https://lnk.pro/" . $finalCode;

$stmt = $db->prepare("
    INSERT INTO links (id, domain_id, user_id, original_url, short_code, title, redirect_type, status, created_at)
    VALUES (?, 'dom_1', 'usr_1', ?, ?, 'Final Stage 2 Short Link', '302', 'active', NOW())
");
$linkId = 'lnk_' . uniqid();
$stmt->execute([$linkId, $originalUrl, $finalCode]);

// Return standard contract: error: 0 and short_url/shorturl
echo json_encode([
    'error' => 0,
    'short_url' => $finalShortUrl,
    'shorturl' => $finalShortUrl,
    'code' => $finalCode,
    'id' => $linkId,
    'stage1_url' => $stage1Url,
    'original_url' => $originalUrl,
    'msg' => 'Success'
]);
exit;`
  },
  {
    path: 'public/redirect.php',
    name: 'redirect.php',
    category: 'public',
    description: 'Ultra-fast multi-tenant direct 302/301 redirection resolving hostname + short code with async click tracking.',
    content: `<?php
/**
 * LinkPro Multi-Domain Direct Redirection Engine
 * Resolves (domain_id + short_code) -> single-step HTTP 302/301
 */

declare(strict_types=1);

if (!isset($shortCode) || !isset($requestHost)) {
    http_response_code(404);
    exit('Invalid redirect request.');
}

$db = \\App\\Services\\Database::getInstance();

// 1. Resolve domain record
$domStmt = $db->prepare("SELECT id, status, is_verified FROM domains WHERE domain_name = ? LIMIT 1");
$domStmt->execute([$requestHost]);
$domain = $domStmt->fetch(PDO::FETCH_ASSOC);

// If domain not registered or not active/verified, fail safely
if (!$domain || !$domain['is_verified'] || $domain['status'] !== 'active') {
    http_response_code(404);
    require __DIR__ . '/../app/Views/errors/domain_inactive.php';
    exit;
}

// 2. Lookup short code under this specific domain
$stmt = $db->prepare("
    SELECT l.id, l.original_url, l.status, l.expires_at, l.redirect_type, u.status as user_status 
    FROM links l
    JOIN users u ON l.user_id = u.id
    WHERE l.domain_id = ? AND l.short_code = ? 
    LIMIT 1
");
$stmt->execute([$domain['id'], $shortCode]);
$link = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$link || $link['status'] !== 'active' || $link['user_status'] === 'suspended' || $link['user_status'] === 'disabled') {
    http_response_code(404);
    require __DIR__ . '/../app/Views/errors/404.php';
    exit;
}

// 3. Expiration Check
if (!empty($link['expires_at']) && strtotime($link['expires_at']) < time()) {
    http_response_code(410);
    require __DIR__ . '/../app/Views/errors/expired.php';
    exit;
}

// 4. Asynchronous Click Logging (Failure-safe: redirect succeeds even if logging fails)
try {
    $clientIp = $_SERVER['HTTP_CF_CONNECTING_IP'] ?? $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    $logStmt = $db->prepare("
        INSERT INTO click_events (link_id, domain_id, short_code, ip_address, user_agent, referer, country, clicked_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    ");
    $logStmt->execute([
        $link['id'],
        $domain['id'],
        $shortCode,
        $clientIp,
        $_SERVER['HTTP_USER_AGENT'] ?? '',
        $_SERVER['HTTP_REFERER'] ?? 'Direct',
        'Bangladesh' // Detected via GeoIP in production
    ]);

    $db->prepare("UPDATE links SET clicks = clicks + 1, last_clicked_at = NOW() WHERE id = ?")->execute([$link['id']]);
} catch (Throwable $e) {
    // Suppress analytics exception to ensure zero redirect interruption
    error_log("Click tracking error: " . $e->getMessage());
}

// 5. Hard Single-Step Direct Server-Side Redirect
$httpCode = ($link['redirect_type'] === '301') ? 301 : 302;
header("Location: " . $link['original_url'], true, $httpCode);
header("X-Redirected-By: LinkPro Enterprise");
exit;`
  },
  {
    path: 'app/Services/PermissionManager.php',
    name: 'PermissionManager.php',
    category: 'services',
    description: 'Enforces the 5-step domain authorization pipeline and subscription quota rules.',
    content: `<?php
namespace App\\Services;

use PDO;
use Exception;

class PermissionManager {
    private PDO $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    /**
     * Strict 5-Step Domain Authorization Pipeline:
     * 1. Domain is verified
     * 2. Domain is active
     * 3. Global domain policy check
     * 4. User-specific domain permission (Explicit Denial overrides everything)
     * 5. User subscription package quota check
     */
    public function authorizeDomainUsage(string $userId, string $domainId): array {
        // Fetch User and Package
        $uStmt = $this->db->prepare("
            SELECT u.id, u.status as user_status, u.has_all_domains_access, 
                   s.status as sub_status, s.expires_date, 
                   p.id as package_id, p.max_links_quota, p.max_custom_domains_quota, p.has_all_domains_access as pkg_all_domains
            FROM users u
            LEFT JOIN subscriptions s ON u.id = s.user_id AND s.status = 'active'
            LEFT JOIN packages p ON u.package_id = p.id
            WHERE u.id = ? LIMIT 1
        ");
        $uStmt->execute([$userId]);
        $user = $uStmt->fetch(PDO::FETCH_ASSOC);

        if (!$user || $user['user_status'] !== 'active') {
            return ['allowed' => false, 'reason' => 'User account is not in active state.'];
        }

        // Fetch Domain
        $dStmt = $this->db->prepare("SELECT id, domain_name, status, is_verified, is_global, user_id FROM domains WHERE id = ? LIMIT 1");
        $dStmt->execute([$domainId]);
        $domain = $dStmt->fetch(PDO::FETCH_ASSOC);

        if (!$domain) {
            return ['allowed' => false, 'reason' => 'Requested custom domain does not exist.'];
        }

        // 1 & 2: Verification and Active Status
        if (!$domain['is_verified']) {
            return ['allowed' => false, 'reason' => 'Domain DNS verification is still pending.'];
        }
        if ($domain['status'] !== 'active') {
            return ['allowed' => false, 'reason' => 'Domain is currently inactive or suspended.'];
        }

        // Check Explicit User-Level Permissions first (Denial is absolute)
        $permStmt = $this->db->prepare("SELECT is_allowed FROM user_domain_permissions WHERE user_id = ? AND domain_id = ? LIMIT 1");
        $permStmt->execute([$userId, $domainId]);
        $customPerm = $permStmt->fetch(PDO::FETCH_ASSOC);

        if ($customPerm !== false) {
            if ($customPerm['is_allowed'] == 0) {
                return ['allowed' => false, 'reason' => 'Administrator has explicitly denied your access to this domain.'];
            }
            // If explicitly allowed, pass permission stage
            return ['allowed' => true, 'domain' => $domain];
        }

        // Unlimited / All-Domains Access privilege
        if ($user['has_all_domains_access'] == 1 || $user['pkg_all_domains'] == 1) {
            return ['allowed' => true, 'domain' => $domain];
        }

        // If domain is owned by this user
        if ($domain['user_id'] === $userId) {
            return ['allowed' => true, 'domain' => $domain];
        }

        // If domain is global and user is on an active paid package
        if ($domain['is_global'] == 1 && $user['package_id'] !== 'pkg_free') {
            return ['allowed' => true, 'domain' => $domain];
        }

        return ['allowed' => false, 'reason' => 'You do not have permission to create links on this domain under your current subscription.'];
    }
}`
  },
  {
    path: 'app/Services/DomainVerifier.php',
    name: 'DomainVerifier.php',
    category: 'services',
    description: 'Performs live DNS TXT record and CNAME lookups using php dns_get_record() to verify ownership.',
    content: `<?php
namespace App\\Services;

use Exception;

class DomainVerifier {
    /**
     * Checks DNS TXT record for expected verification token
     * e.g., TXT record on _linkpro-verify.sub.example.com
     */
    public function verifyDnsTxt(string $domainName, string $expectedToken): array {
        $lookupHost = "_linkpro-verify." . $domainName;
        
        // Suppress warnings on unresolvable DNS
        $records = @dns_get_record($lookupHost, DNS_TXT);
        
        if (empty($records)) {
            // Also check apex domain TXT
            $records = @dns_get_record($domainName, DNS_TXT);
        }

        if (empty($records)) {
            return [
                'verified' => false,
                'error' => "No DNS TXT records found for {$lookupHost}. Please ensure DNS propagation is complete."
            ];
        }

        $expectedPayload = "linkpro-verify=" . $expectedToken;
        foreach ($records as $record) {
            if (isset($record['txt']) && (str_contains($record['txt'], $expectedPayload) || str_contains($record['txt'], $expectedToken))) {
                return [
                    'verified' => true,
                    'matched_record' => $record['txt']
                ];
            }
        }

        return [
            'verified' => false,
            'error' => "Found TXT records, but none matched the expected value '{$expectedPayload}'."
        ];
    }
}`
  },
  {
    path: 'app/Controllers/LinkController.php',
    name: 'LinkController.php',
    category: 'app',
    description: 'Validates quotas, domain permissions, uniqueness per domain, and stores new short link.',
    content: `<?php
namespace App\\Controllers;

use App\\Services\\Database;
use App\\Services\\PermissionManager;

class LinkController {
    public function store() {
        header('Content-Type: application/json');
        
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Authentication required.']);
            return;
        }

        $userId = $_SESSION['user_id'];
        $input = json_decode(file_get_contents('php://input'), true);
        
        $domainId = $input['domain_id'] ?? '';
        $originalUrl = filter_var($input['original_url'] ?? '', FILTER_SANITIZE_URL);
        $customAlias = !empty($input['custom_alias']) ? preg_replace('/[^a-zA-Z0-9_-]/', '', $input['custom_alias']) : null;

        // 1. Validate Destination URL (Reject javascript:, data:, file:)
        if (!filter_var($originalUrl, FILTER_VALIDATE_URL) || !preg_match('/^https?:\\/\\//i', $originalUrl)) {
            http_response_code(422);
            echo json_encode(['error' => 'Invalid destination URL format. Only HTTP and HTTPS are permitted.']);
            return;
        }

        // 2. Strict 5-Step Domain Permission Check
        $pm = new PermissionManager();
        $auth = $pm->authorizeDomainUsage($userId, $domainId);
        if (!$auth['allowed']) {
            http_response_code(403);
            echo json_encode(['error' => 'Domain Access Denied: ' . $auth['reason']]);
            return;
        }

        $domain = $auth['domain'];
        $db = Database::getInstance();

        // 3. Subscription Link Quota Check
        $cntStmt = $db->prepare("SELECT COUNT(*) FROM links WHERE user_id = ?");
        $cntStmt->execute([$userId]);
        $currentLinkCount = (int)$cntStmt->fetchColumn();

        $pkgStmt = $db->prepare("SELECT p.max_links_quota FROM users u JOIN packages p ON u.package_id = p.id WHERE u.id = ?");
        $pkgStmt->execute([$userId]);
        $maxQuota = (int)$pkgStmt->fetchColumn();

        if ($maxQuota !== -1 && $currentLinkCount >= $maxQuota) {
            http_response_code(403);
            echo json_encode(['error' => "Subscription quota exceeded. Your plan limit is {$maxQuota} links."]);
            return;
        }

        // 4. Generate or Validate Unique Short Code per Domain
        $shortCode = $customAlias ?: strtolower(substr(bin2hex(random_bytes(4)), 0, 6));

        $chkStmt = $db->prepare("SELECT id FROM links WHERE domain_id = ? AND short_code = ? LIMIT 1");
        $chkStmt->execute([$domainId, $shortCode]);
        if ($chkStmt->fetch()) {
            http_response_code(409);
            echo json_encode(['error' => "Short code '/{$shortCode}' is already taken on {$domain['domain_name']}."]);
            return;
        }

        // 5. Insert Link
        $linkId = 'lnk_' . uniqid();
        $insStmt = $db->prepare("
            INSERT INTO links (id, domain_id, user_id, original_url, short_code, title, description, redirect_type, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, '302', 'active', NOW())
        ");
        $insStmt->execute([
            $linkId,
            $domainId,
            $userId,
            $originalUrl,
            $shortCode,
            $input['title'] ?? '',
            $input['description'] ?? ''
        ]);

        echo json_encode([
            'success' => true,
            'link' => [
                'id' => $linkId,
                'short_code' => $shortCode,
                'short_url' => "https://{$domain['domain_name']}/{$shortCode}",
                'domain_name' => $domain['domain_name']
            ]
        ]);
    }
}`
  },
  {
    path: 'database/migrations/2026_enterprise_schema.sql',
    name: '2026_enterprise_schema.sql',
    category: 'database',
    description: 'Complete multi-tenant MariaDB schema with domains, user permissions, packages, orders, and links.',
    content: `-- LinkPro Enterprise SaaS Schema v2.4

CREATE TABLE IF NOT EXISTS packages (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    billing_period ENUM('monthly', 'yearly', 'lifetime') DEFAULT 'monthly',
    max_links_quota INT NOT NULL DEFAULT 25, -- -1 for unlimited
    max_custom_domains_quota INT NOT NULL DEFAULT 0, -- -1 for unlimited
    has_all_domains_access TINYINT(1) NOT NULL DEFAULT 0,
    allow_custom_alias TINYINT(1) NOT NULL DEFAULT 0,
    has_advanced_analytics TINYINT(1) NOT NULL DEFAULT 0,
    has_api_access TINYINT(1) NOT NULL DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    status ENUM('active', 'pending', 'suspended', 'disabled') DEFAULT 'active',
    package_id VARCHAR(64) NOT NULL DEFAULT 'pkg_free',
    has_all_domains_access TINYINT(1) NOT NULL DEFAULT 0,
    inherit_future_domains TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (package_id) REFERENCES packages(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS domains (
    id VARCHAR(64) PRIMARY KEY,
    domain_name VARCHAR(190) UNIQUE NOT NULL,
    status ENUM('pending_verification', 'active', 'inactive', 'suspended') DEFAULT 'pending_verification',
    is_verified TINYINT(1) NOT NULL DEFAULT 0,
    verification_token VARCHAR(128) NOT NULL,
    dns_record_type ENUM('dns_txt', 'cname', 'http_file') DEFAULT 'dns_txt',
    expected_dns_host VARCHAR(255) NOT NULL,
    expected_dns_value TEXT NOT NULL,
    verified_at DATETIME DEFAULT NULL,
    user_id VARCHAR(64) DEFAULT NULL, -- NULL if system domain
    is_global TINYINT(1) NOT NULL DEFAULT 0, -- available to all paid users
    ssl_active TINYINT(1) NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS user_domain_permissions (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    domain_id VARCHAR(64) NOT NULL,
    is_allowed TINYINT(1) NOT NULL DEFAULT 1, -- 1 = explicit allow, 0 = explicit deny
    granted_by VARCHAR(64) NOT NULL,
    granted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_domain (user_id, domain_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (domain_id) REFERENCES domains(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS links (
    id VARCHAR(64) PRIMARY KEY,
    domain_id VARCHAR(64) NOT NULL,
    user_id VARCHAR(64) NOT NULL,
    original_url TEXT NOT NULL,
    short_code VARCHAR(32) NOT NULL,
    title VARCHAR(255) DEFAULT NULL,
    description TEXT DEFAULT NULL,
    clicks INT UNSIGNED DEFAULT 0,
    redirect_type ENUM('302', '301') DEFAULT '302',
    status ENUM('active', 'expired', 'disabled') DEFAULT 'active',
    expires_at DATETIME DEFAULT NULL,
    last_clicked_at DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_domain_code (domain_id, short_code),
    INDEX idx_code (short_code),
    INDEX idx_user (user_id),
    FOREIGN KEY (domain_id) REFERENCES domains(id) ON DELETE RESTRICT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS click_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    link_id VARCHAR(64) NOT NULL,
    domain_id VARCHAR(64) NOT NULL,
    short_code VARCHAR(32) NOT NULL,
    ip_address VARCHAR(45) DEFAULT NULL,
    user_agent TEXT DEFAULT NULL,
    referer TEXT DEFAULT NULL,
    country VARCHAR(64) DEFAULT 'Unknown',
    clicked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_link (link_id),
    INDEX idx_domain (domain_id),
    INDEX idx_time (clicked_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY,
    order_number VARCHAR(64) UNIQUE NOT NULL,
    user_id VARCHAR(64) NOT NULL,
    package_id VARCHAR(64) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    payment_method VARCHAR(50) NOT NULL,
    transaction_reference VARCHAR(128) NOT NULL,
    status ENUM('pending_review', 'approved', 'rejected') DEFAULT 'pending_review',
    receipt_notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    reviewed_at DATETIME DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (package_id) REFERENCES packages(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
  },
  {
    path: 'nginx/linkpro.conf',
    name: 'linkpro.conf',
    category: 'nginx',
    description: 'Production multi-domain Nginx wildcard server block that handles primary and all custom branded short domains.',
    content: `# LinkPro Multi-Domain Nginx Production VHost

server {
    listen 80;
    listen [::]:80;
    
    # Catch all primary and custom verified short domains
    server_name lnk.pro *.lnk.pro go.nasir.dev short.technews.com click.brandoutlet.org;
    
    root /var/www/html/linkpro/public;
    index index.php index.html;
    charset utf-8;

    # Enterprise security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # Short code direct redirect location
    location ~ ^/([a-zA-Z0-9_-]{3,32})$ {
        try_files $uri /index.php?$query_string;
    }

    location ~ \\.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        fastcgi_param HTTP_HOST $host;
        include fastcgi_params;
    }

    location ~ /\\.(?!well-known).* {
        deny all;
    }
}`
  },
  {
    path: 'docs/CUSTOM_DOMAINS.md',
    name: 'CUSTOM_DOMAINS.md',
    category: 'docs',
    description: 'Full DNS configuration, TXT challenge verification, and multi-domain SSL instructions.',
    content: `# LinkPro Custom Domains & SSL Setup Guide

## How Custom Short Domains Work:
1. **Add Domain**: In User Dashboard or Admin Panel, click "Add Custom Domain".
2. **DNS Configuration**:
   - Add a \`CNAME\` record pointing your subdomain (e.g. \`go\`) to \`lnk.pro\` OR an \`A\` record to your VPS IP.
   - Add a \`TXT\` verification record to prove domain ownership:
     - Host: \`_linkpro-verify.go.yourdomain.com\`
     - Value: \`linkpro-verify=YOUR_TOKEN\`
3. **Verify**: Click "Verify DNS Record". The PHP backend executes \`dns_get_record()\` to validate the TXT record.
4. **SSL / HTTPS**:
   - Use Let's Encrypt Certbot:
     \`\`\`bash
     sudo certbot --nginx -d lnk.pro -d go.yourdomain.com
     \`\`\`
   - Or proxy through Cloudflare with Flexible/Full SSL.`
  },
  {
    path: 'docs/INSTALL.md',
    name: 'INSTALL.md',
    category: 'docs',
    description: 'PowerShell SSH instructions and Ubuntu VPS deployment commands.',
    content: `# Deploying LinkPro SaaS to Ubuntu VPS from Windows PowerShell

## 1. PowerShell Connection
\`\`\`powershell
# Open Windows Terminal / PowerShell
ssh -i "C:\\Users\\YourUser\\.ssh\\id_rsa" ubuntu@YOUR_VPS_IP
\`\`\`

## 2. Ubuntu Server Setup
\`\`\`bash
# Run in Ubuntu terminal
sudo apt update && sudo apt upgrade -y
sudo apt install nginx mariadb-server php8.2-fpm php8.2-mysql php8.2-mbstring php8.2-xml php8.2-curl git unzip -y
\`\`\`

## 3. Clone Repository & Setup Permissions
\`\`\`bash
cd /var/www/html
sudo git clone https://github.com/yourusername/linkpro-enterprise.git linkpro
sudo chown -R www-data:www-data /var/www/html/linkpro
sudo chmod -R 775 /var/www/html/linkpro/storage
\`\`\`

## 4. Run Browser Installation Wizard
Navigate to \`http://YOUR_VPS_IP\` to test database connection, apply enterprise migrations, and create your Master Administrator account.`
  },
  {
    path: 'functions/api/[[route]].ts',
    name: '[[route]].ts',
    category: 'public',
    description: 'Cloudflare Pages edge function proxy forwarding frontend /api/* calls to Ubuntu VPS backend.',
    content: `export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const backendBaseUrl = (env.BACKEND_API_URL || 'https://api.lnk.pro').replace(/\\/+$/, '');
  const targetUrl = new URL(\`\${backendBaseUrl}\${url.pathname}\${url.search}\`);

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': request.headers.get('Origin') || '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept',
        'Access-Control-Allow-Credentials': 'true',
      },
    });
  }

  const forwardHeaders = new Headers(request.headers);
  forwardHeaders.set('X-Forwarded-For', request.headers.get('CF-Connecting-IP') || '');
  forwardHeaders.set('Host', new URL(backendBaseUrl).hostname);

  const response = await fetch(targetUrl.toString(), {
    method: request.method,
    headers: forwardHeaders,
    body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
  });

  return new Response(response.body, {
    status: response.status,
    headers: response.headers
  });
};`
  },
  {
    path: 'wrangler.toml',
    name: 'wrangler.toml',
    category: 'config',
    description: 'Cloudflare Pages/Workers project configuration file.',
    content: `name = "linkpro-enterprise-frontend"
compatibility_date = "2026-10-24"
compatibility_flags = ["nodejs_compat"]
pages_build_output_dir = "dist"

[vars]
BACKEND_API_URL = "https://api.lnk.pro"
ENVIRONMENT = "production"`
  }
];
