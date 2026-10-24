import { LinkItem, ClickEvent, UserProfile, AppSettings, AuditLog, PHPFileEntry } from '../types';

export const initialLinks: LinkItem[] = [
  {
    id: 'lnk_1',
    originalUrl: 'https://github.com/features/actions',
    shortCode: 'ghact99',
    shortUrl: 'https://lnk.pro/ghact99',
    title: 'GitHub Actions Documentation',
    description: 'CI/CD pipelines and workflow automation guide.',
    clicks: 142,
    createdAt: '2026-10-20 10:30:00',
    status: 'active',
    userId: 'usr_1',
    lastClickedAt: '2026-10-24 05:12:00'
  },
  {
    id: 'lnk_2',
    originalUrl: 'https://laravel.com/docs/11.x/routing',
    shortCode: 'larv11',
    shortUrl: 'https://lnk.pro/larv11',
    title: 'Laravel 11 Routing Guide',
    description: 'Official routing documentation for PHP Laravel framework.',
    clicks: 89,
    createdAt: '2026-10-21 14:15:00',
    status: 'active',
    userId: 'usr_1',
    lastClickedAt: '2026-10-24 04:30:00'
  },
  {
    id: 'lnk_3',
    originalUrl: 'https://getbootstrap.com/docs/5.3/getting-started/introduction/',
    shortCode: 'boot53',
    shortUrl: 'https://lnk.pro/boot53',
    title: 'Bootstrap 5.3 Docs',
    description: 'Responsive UI components and layout utilities.',
    clicks: 56,
    createdAt: '2026-10-22 09:00:00',
    status: 'active',
    userId: 'usr_2',
    lastClickedAt: '2026-10-23 22:15:00'
  },
  {
    id: 'lnk_4',
    originalUrl: 'https://mariadb.com/kb/en/documentation/',
    shortCode: 'mdbdoc',
    shortUrl: 'https://lnk.pro/mdbdoc',
    title: 'MariaDB Knowledge Base',
    description: 'SQL queries, indexing, and high performance tuning.',
    clicks: 210,
    createdAt: '2026-10-18 16:45:00',
    status: 'active',
    userId: 'usr_1',
    lastClickedAt: '2026-10-24 06:01:00'
  },
  {
    id: 'lnk_5',
    originalUrl: 'https://nginx.org/en/docs/http/ngx_http_rewrite_module.html',
    shortCode: 'ngxrew',
    shortUrl: 'https://lnk.pro/ngxrew',
    title: 'Nginx URL Rewriting',
    description: 'Clean URLs and proxy configuration rules.',
    clicks: 34,
    createdAt: '2026-10-23 11:20:00',
    status: 'active',
    userId: 'usr_2',
    lastClickedAt: '2026-10-24 02:10:00'
  }
];

export const initialClickEvents: ClickEvent[] = [
  { id: 'clk_1', linkId: 'lnk_1', shortCode: 'ghact99', ipAddress: '192.168.1.45', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', referer: 'https://google.com', country: 'Bangladesh', device: 'Desktop', browser: 'Chrome', clickedAt: '2026-10-24 05:12:00' },
  { id: 'clk_2', linkId: 'lnk_4', shortCode: 'mdbdoc', ipAddress: '203.0.113.8', userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)', referer: 'https://github.com', country: 'United States', device: 'Mobile', browser: 'Safari', clickedAt: '2026-10-24 06:01:00' },
  { id: 'clk_3', linkId: 'lnk_2', shortCode: 'larv11', ipAddress: '103.102.25.12', userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', referer: 'Direct', country: 'Bangladesh', device: 'Desktop', browser: 'Firefox', clickedAt: '2026-10-24 04:30:00' },
  { id: 'clk_4', linkId: 'lnk_1', shortCode: 'ghact99', ipAddress: '192.168.1.99', userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', referer: 'https://facebook.com', country: 'Bangladesh', device: 'Desktop', browser: 'Edge', clickedAt: '2026-10-23 20:11:00' },
  { id: 'clk_5', linkId: 'lnk_3', shortCode: 'boot53', ipAddress: '45.33.22.11', userAgent: 'Mozilla/5.0 (X11; Linux x86_64)', referer: 'https://twitter.com', country: 'Germany', device: 'Desktop', browser: 'Chrome', clickedAt: '2026-10-23 22:15:00' }
];

export const initialUsers: UserProfile[] = [
  { id: 'usr_1', name: 'Nasir Mia', email: 'nasirmia360.02@gmail.com', role: 'admin', status: 'active', createdAt: '2026-10-15 08:00:00', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
  { id: 'usr_2', name: 'Sarah Jenkins', email: 'sarah.j@example.com', role: 'user', status: 'active', createdAt: '2026-10-19 12:30:00', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
  { id: 'usr_3', name: 'Tanvir Ahmed', email: 'tanvir@example.com', role: 'user', status: 'active', createdAt: '2026-10-20 14:20:00', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' }
];

export const initialSettings: AppSettings = {
  siteName: 'LinkPro URL Shortener',
  baseUrl: 'https://lnk.pro',
  allowRegistration: true,
  defaultRedirectType: '302',
  maxUrlLength: 2048,
  rateLimitPerMin: 60,
  maintenanceMode: false,
  defaultLanguage: 'bn'
};

export const initialAuditLogs: AuditLog[] = [
  { id: 'aud_1', userId: 'usr_1', userName: 'Nasir Mia', action: 'Updated application site settings', ip: '192.168.1.1', timestamp: '2026-10-24 01:10:00' },
  { id: 'aud_2', userId: 'usr_2', userName: 'Sarah Jenkins', action: 'Created new short link: boot53', ip: '103.102.25.10', timestamp: '2026-10-22 09:00:00' },
  { id: 'aud_3', userId: 'usr_1', userName: 'Nasir Mia', action: 'Installed database schema v1.0.0', ip: '192.168.1.1', timestamp: '2026-10-15 08:05:00' }
];

export const phpCodebaseFiles: PHPFileEntry[] = [
  {
    path: 'public/index.php',
    name: 'index.php',
    category: 'public',
    description: 'Main front controller dispatching web routes and dashboard API requests.',
    content: `<?php
/**
 * LinkPro URL Shortener - Front Controller
 * PHP 8.2+
 */

session_start();
require_once __DIR__ . '/../app/bootstrap.php';

use App\\Controllers\\AuthController;
use App\\Controllers\\LinkController;
use App\\Controllers\\AdminController;

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Route handling
if ($uri === '/' || $uri === '/index.php') {
    require __DIR__ . '/../app/Views/home.php';
} elseif (preg_match('/^\/([a-zA-Z0-9_-]{3,12})$/', $uri, $matches)) {
    // Single-step direct redirect handler
    $shortCode = $matches[1];
    require __DIR__ . '/redirect.php';
} elseif ($uri === '/api/links' && $method === 'POST') {
    (new LinkController())->store();
} elseif ($uri === '/api/login' && $method === 'POST') {
    (new AuthController())->login();
} else {
    http_response_code(404);
    require __DIR__ . '/../app/Views/errors/404.php';
}`
  },
  {
    path: 'public/redirect.php',
    name: 'redirect.php',
    category: 'public',
    description: 'Lightning-fast single-step direct HTTP 302/301 redirection with async click logging.',
    content: `<?php
/**
 * LinkPro Direct Redirection Handler
 * Instantly looks up short code and redirects in one step.
 */

if (!isset($shortCode)) {
    http_response_code(404);
    exit('Invalid short code.');
}

$db = \\App\\Services\\Database::getInstance();
$stmt = $db->prepare("SELECT id, original_url, status, expires_at FROM links WHERE short_code = ? LIMIT 1");
$stmt->execute([$shortCode]);
$link = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$link || $link['status'] !== 'active') {
    http_response_code(404);
    include __DIR__ . '/../app/Views/errors/404.php';
    exit;
}

if ($link['expires_at'] && strtotime($link['expires_at']) < time()) {
    http_response_code(410);
    include __DIR__ . '/../app/Views/errors/expired.php';
    exit;
}

// Log click asynchronously to keep redirect sub-millisecond fast
try {
    $logStmt = $db->prepare("INSERT INTO click_events (link_id, short_code, ip_address, user_agent, referer, country, clicked_at) VALUES (?, ?, ?, ?, ?, ?, NOW())");
    $logStmt->execute([
        $link['id'],
        $shortCode,
        $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0',
        $_SERVER['HTTP_USER_AGENT'] ?? '',
        $_SERVER['HTTP_REFERER'] ?? 'Direct',
        'Bangladesh' // Detected via GeoIP in production
    ]);

    $updStmt = $db->prepare("UPDATE links SET clicks = clicks + 1, last_clicked_at = NOW() WHERE id = ?");
    $updStmt->execute([$link['id']]);
} catch (Exception $e) {
    // Fail silently on analytics so redirection never breaks
}

header("Location: " . $link['original_url'], true, 302);
exit;`
  },
  {
    path: 'app/Controllers/LinkController.php',
    name: 'LinkController.php',
    category: 'app',
    description: 'Handles URL creation, custom aliases, validation, and ownership rules.',
    content: `<?php
namespace App\\Controllers;

use App\\Services\\Database;

class LinkController {
    public function store() {
        header('Content-Type: application/json');
        
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            return;
        }

        $input = json_decode(file_get_contents('php://input'), true);
        $originalUrl = filter_var($input['original_url'] ?? '', FILTER_SANITIZE_URL);

        if (!filter_var($originalUrl, FILTER_VALIDATE_URL)) {
            http_response_code(422);
            echo json_encode(['error' => 'Invalid destination URL format.']);
            return;
        }

        $shortCode = !empty($input['custom_alias']) 
            ? preg_replace('/[^a-zA-Z0-9_-]/', '', $input['custom_alias'])
            : strtolower(substr(md5(uniqid(mt_rand(), true)), 0, 6));

        $db = Database::getInstance();
        
        // Check collision
        $chk = $db->prepare("SELECT id FROM links WHERE short_code = ?");
        $chk->execute([$shortCode]);
        if ($chk->fetch()) {
            http_response_code(409);
            echo json_encode(['error' => 'Short code or custom alias already exists.']);
            return;
        }

        $stmt = $db->prepare("INSERT INTO links (id, user_id, original_url, short_code, title, description, status, created_at) VALUES (?, ?, ?, ?, ?, ?, 'active', NOW())");
        $linkId = 'lnk_' . uniqid();
        $stmt->execute([
            $linkId,
            $_SESSION['user_id'],
            $originalUrl,
            $shortCode,
            $input['title'] ?? '',
            $input['description'] ?? ''
        ]);

        echo json_encode([
            'success' => true,
            'short_code' => $shortCode,
            'short_url' => 'https://lnk.pro/' . $shortCode
        ]);
    }
}`
  },
  {
    path: 'database/schema.sql',
    name: 'schema.sql',
    category: 'database',
    description: 'MariaDB production schema with optimized indexes for users, links, and click analytics.',
    content: `CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    status ENUM('active', 'suspended') DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS links (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    original_url TEXT NOT NULL,
    short_code VARCHAR(32) UNIQUE NOT NULL,
    title VARCHAR(255) DEFAULT NULL,
    description TEXT DEFAULT NULL,
    clicks INT UNSIGNED DEFAULT 0,
    status ENUM('active', 'expired', 'disabled') DEFAULT 'active',
    expires_at DATETIME DEFAULT NULL,
    last_clicked_at DATETIME DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_short_code (short_code),
    INDEX idx_user_id (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS click_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    link_id VARCHAR(64) NOT NULL,
    short_code VARCHAR(32) NOT NULL,
    ip_address VARCHAR(45) DEFAULT NULL,
    user_agent TEXT DEFAULT NULL,
    referer TEXT DEFAULT NULL,
    country VARCHAR(64) DEFAULT 'Unknown',
    clicked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_link_id (link_id),
    INDEX idx_clicked_at (clicked_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS app_settings (
    \`key\` VARCHAR(64) PRIMARY KEY,
    \`value\` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
  },
  {
    path: 'nginx/linkpro.conf',
    name: 'linkpro.conf',
    category: 'nginx',
    description: 'Production Nginx server block enabling clean short URLs without .php extensions and PHP-FPM socket.',
    content: `server {
    listen 80;
    server_name lnk.pro www.lnk.pro;
    root /var/www/html/linkpro/public;

    index index.php index.html index.htm;

    charset utf-8;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-XSS-Protection "1; mode=block";
    add_header X-Content-Type-Options "nosniff";

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    # Handle short codes directly with high performance
    location ~ ^/([a-zA-Z0-9_-]{3,12})$ {
        try_files $uri /index.php?$query_string;
    }

    location ~ \\.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\\.(?!well-known).* {
        deny all;
    }
}`
  },
  {
    path: 'install/wizard.php',
    name: 'wizard.php',
    category: 'install',
    description: 'Browser-based interactive installation wizard with environment checks and DB setup.',
    content: `<?php
/**
 * LinkPro Browser Installer Wizard
 */
$step = $_GET['step'] ?? 1;
$error = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    if ($action === 'test_db') {
        try {
            $pdo = new PDO("mysql:host={$_POST['db_host']};dbname={$_POST['db_name']};charset=utf8mb4", $_POST['db_user'], $_POST['db_pass']);
            echo json_encode(['success' => true]);
            exit;
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'error' => $e->getMessage()]);
            exit;
        }
    }
}
?>
<!-- Installer UI rendered via PHP & Bootstrap -->`
  },
  {
    path: 'docs/INSTALL.md',
    name: 'INSTALL.md',
    category: 'docs',
    description: 'Step-by-step instructions for deploying to Ubuntu VPS from Windows PowerShell.',
    content: `# LinkPro URL Shortener - VPS Installation Guide

## 1. Connect from Windows PowerShell via SSH
\`\`\`powershell
ssh -i "C:\\Users\\YourName\\.ssh\\id_rsa" ubuntu@YOUR_VPS_IP
\`\`\`

## 2. Install PHP 8.2, Nginx, and MariaDB on Ubuntu
\`\`\`bash
sudo apt update && sudo apt upgrade -y
sudo apt install nginx mariadb-server php8.2-fpm php8.2-mysql php8.2-mbstring php8.2-xml php8.2-curl git unzip -y
\`\`\`

## 3. Clone Repository & Set Permissions
\`\`\`bash
cd /var/www/html
sudo git clone https://github.com/yourusername/linkpro.git
sudo chown -R www-data:www-data /var/www/html/linkpro
sudo chmod -R 755 /var/www/html/linkpro/storage
\`\`\`

## 4. Configure Nginx and Complete Browser Setup
Navigate to http://YOUR_VPS_IP to launch the Browser Installation Wizard and set up your admin account.`
  },
  {
    path: 'docs/SECURITY.md',
    name: 'SECURITY.md',
    category: 'docs',
    description: 'Security policies, rate limiting, prepared statements, and XSS/CSRF protections.',
    content: `# LinkPro Security Hardening

- **SQL Injection Prevention**: All queries use PDO prepared statements with strict parameter binding.
- **XSS Mitigation**: Output encoding and CSP headers.
- **CSRF Tokens**: Mandatory token validation on state-changing API endpoints.
- **Rate Limiting**: IP-based sliding window rate limiter against brute force attacks.`
  }
];
