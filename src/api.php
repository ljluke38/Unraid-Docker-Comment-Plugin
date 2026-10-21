<?php
$configFile = '/boot/config/plugins/docker-comments/comments.json';

header('Content-Type: application/json');

// Handle POST request: Saving a comment
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $comments = [];
    
    if (file_exists($configFile)) {
        $comments = json_decode(file_get_contents($configFile), true) ?: [];
    }
    
    if (isset($data['container']) && isset($data['comment'])) {
        $containerName = htmlspecialchars($data['container']);
        $comments[$containerName] = htmlspecialchars($data['comment']);
        
        file_put_contents($configFile, json_encode($comments, JSON_PRETTY_PRINT));
        echo json_encode(['status' => 'success']);
    } else {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Invalid data payload']);
    }
    exit;
}

// Handle GET request: Retrieving all comments
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($configFile)) {
        echo file_get_contents($configFile);
    } else {
        echo '{}';
    }
    exit;
}
