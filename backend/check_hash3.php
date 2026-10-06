<?php
$pdo = new PDO('sqlite:database/database.sqlite');
$stmt = $pdo->query('SELECT token FROM personal_access_tokens WHERE id = 2');
$row = $stmt->fetch(PDO::FETCH_ASSOC);
echo 'Stored hash: ' . $row['token'] . PHP_EOL;

// Test with full token including ID prefix
$fullToken = '2|zVn11BbYwgLQ7i3Pzs2bIFSAmexKxKZ2iLHHW5JUed3531a5';
echo 'Full token: ' . $fullToken . PHP_EOL;
echo 'Hash matches (full): ' . (password_verify($fullToken, $row['token']) ? 'YES' : 'NO') . PHP_EOL;

// Test with just the plain text part
$plain = 'zVn11BbYwgLQ7i3Pzs2bIFSAmexKxKZ2iLHHW5JUed3531a5';
echo 'Plain token: ' . $plain . PHP_EOL;
echo 'Hash matches (plain): ' . (password_verify($plain, $row['token']) ? 'YES' : 'NO') . PHP_EOL;