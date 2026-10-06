<?php
$pdo = new PDO('sqlite:database/database.sqlite');
$stmt = $pdo->query('SELECT token FROM personal_access_tokens WHERE id = 1');
$row = $stmt->fetch(PDO::FETCH_ASSOC);
echo 'Stored hash: ' . $row['token'] . PHP_EOL;
$plain = 'YYfv3J233XJeJ7IRd7raAamak1vy1TkWpJcztBhr4a860e8a';
echo 'Plain token: ' . $plain . PHP_EOL;
echo 'Hash matches: ' . (password_verify($plain, $row['token']) ? 'YES' : 'NO') . PHP_EOL;