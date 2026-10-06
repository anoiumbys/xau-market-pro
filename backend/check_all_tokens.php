<?php
$pdo = new PDO('sqlite:database/database.sqlite');
$stmt = $pdo->query('SELECT * FROM personal_access_tokens');
while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    echo 'ID: ' . $row['id'] . ' Tokenable: ' . $row['tokenable_type'] . ':' . $row['tokenable_id'] . ' Token: ' . substr($row['token'], 0, 20) . '... Name: ' . $row['name'] . ' Expires: ' . $row['expires_at'] . PHP_EOL;
}