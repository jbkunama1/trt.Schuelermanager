<?php
error_reporting(0);
ini_set('display_errors', 0);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$dbFile = __DIR__ . '/schueler_manager.db';

try {
    if (!extension_loaded('pdo_sqlite')) {
        throw new Exception('SQLite PDO extension nicht verfügbar');
    }
    
    if (!is_writable(__DIR__)) {
        throw new Exception('Verzeichnis nicht beschreibbar');
    }
    
    $db = new PDO('sqlite:' . $dbFile);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $createTable = "CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        klasse TEXT NOT NULL,
        fach TEXT NOT NULL,
        besonderheiten TEXT DEFAULT '',
        sozialpunkte INTEGER DEFAULT 0,
        noten_schriftlich TEXT DEFAULT '[]',
        noten_muendlich TEXT DEFAULT '[]',
        sonstiges TEXT DEFAULT '',
        image TEXT DEFAULT '',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )";
    
    $db->exec($createTable);
    
} catch(Exception $e) {
    error_log('Realteacher DB Error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Datenbankfehler', 'details' => $e->getMessage()]);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $action = $_GET['action'] ?? '';
    
    if ($action === 'getAll') {
        try {
            $stmt = $db->query("SELECT * FROM students ORDER BY klasse, name");
            $students = $stmt->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($students);
        } catch(Exception $e) {
            error_log('Realteacher Query Error: ' . $e->getMessage());
            echo json_encode([]);
        }
    }
    
} elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $action = $input['action'] ?? '';
    
    if ($action === 'save') {
        try {
            $data = $input['data'];
            
            if (!empty($data['id'])) {
                $stmt = $db->prepare("UPDATE students SET 
                    name = :name,
                    klasse = :klasse,
                    fach = :fach,
                    besonderheiten = :besonderheiten,
                    sozialpunkte = :sozialpunkte,
                    noten_schriftlich = :noten_schriftlich,
                    noten_muendlich = :noten_muendlich,
                    sonstiges = :sonstiges,
                    image = :image,
                    updated_at = CURRENT_TIMESTAMP
                    WHERE id = :id");
                $stmt->bindParam(':id', $data['id']);
            } else {
                $stmt = $db->prepare("INSERT INTO students 
                    (name, klasse, fach, besonderheiten, sozialpunkte, noten_schriftlich, noten_muendlich, sonstiges, image) 
                    VALUES (:name, :klasse, :fach, :besonderheiten, :sozialpunkte, :noten_schriftlich, :noten_muendlich, :sonstiges, :image)");
            }
            
            $name = $data['name'] ?? '';
            $klasse = $data['klasse'] ?? '';
            $fach = $data['fach'] ?? '';
            $besonderheiten = $data['besonderheiten'] ?? '';
            $sozialpunkte = $data['sozialpunkte'] ?? 0;
            $noten_schriftlich = $data['noten_schriftlich'] ?? '[]';
            $noten_muendlich = $data['noten_muendlich'] ?? '[]';
            $sonstiges = $data['sonstiges'] ?? '';
            $image = $data['image'] ?? '';
            
            $stmt->bindParam(':name', $name);
            $stmt->bindParam(':klasse', $klasse);
            $stmt->bindParam(':fach', $fach);
            $stmt->bindParam(':besonderheiten', $besonderheiten);
            $stmt->bindParam(':sozialpunkte', $sozialpunkte);
            $stmt->bindParam(':noten_schriftlich', $noten_schriftlich);
            $stmt->bindParam(':noten_muendlich', $noten_muendlich);
            $stmt->bindParam(':sonstiges', $sonstiges);
            $stmt->bindParam(':image', $image);
            
            if ($stmt->execute()) {
                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Fehler beim Speichern']);
            }
        } catch(Exception $e) {
            error_log('Realteacher Save Error: ' . $e->getMessage());
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        
    } elseif ($action === 'delete') {
        try {
            $stmt = $db->prepare("DELETE FROM students WHERE id = :id");
            $stmt->bindParam(':id', $input['id']);
            
            if ($stmt->execute()) {
                echo json_encode(['success' => true]);
            } else {
                echo json_encode(['success' => false]);
            }
        } catch(Exception $e) {
            error_log('Realteacher Delete Error: ' . $e->getMessage());
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
    }
}
?>
