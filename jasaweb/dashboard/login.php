<?php
session_start();

if (isset($_SESSION['loggedin']) && $_SESSION['loggedin'] === true) {
    header("Location: dashboard.php");
    exit;
}

$login_error = '';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    // Hardcoded credentials for demo — replace with DB query and password verification
    if ($username === 'devnarda' && $password === 'password') {
        $_SESSION['loggedin'] = true;
        $_SESSION['username'] = $username;
        header("Location: dashboard.php");
        exit;
    } else {
        $login_error = "Username atau password salah.";
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Login Admin DevNarda</title>
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" />
<style>
  body, html {
    height: 100%;
    background: #f8f9fa;
  }
  .login-container {
    max-width: 400px;
    margin: 6% auto;
    padding: 2rem;
    background: white;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(59, 130, 246, 0.15);
  }
  .error {
    color: #dc3545;
  }
</style>
</head>
<body>
  <div class="login-container shadow">
    <h3 class="mb-4 text-center">Login Admin DevNarda</h3>
    <?php if($login_error): ?>
    <div class="alert alert-danger" role="alert">
      <?php echo htmlspecialchars($login_error); ?>
    </div>
    <?php endif; ?>
    <form method="post" novalidate>
      <div class="form-group">
        <label for="username">Username</label>
        <input type="text" class="form-control" id="username" name="username" required autofocus>
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" class="form-control" id="password" name="password" required>
      </div>
      <button type="submit" class="btn btn-primary btn-block">Masuk</button>
    </form>
  </div>
</body>
</html>
