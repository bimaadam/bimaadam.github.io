<?php
session_start();
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    header("Location: login.php");
    exit;
}
$page = $_GET['page'] ?? 'dashboard';
include 'koneksi.php';

// Helper functions for CRUD operations here or you can separate into included files for brevity

function escape($conn, $str) {
    return htmlspecialchars($conn->real_escape_string($str));
}

// Process POST requests for CRUD (Clients, Financials) based on $page and POST data.
// For brevity, this example includes only minimal process handlers.

// CLIENTS CRUD
if ($page === 'clients' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action'])) {
        $action = $_POST['action'];
        $id = $_POST['id'] ?? '';
        $name = $_POST['name'] ?? '';
        $email = $_POST['email'] ?? '';
        $phone = $_POST['phone'] ?? '';

        if ($action === 'add') {
            $stmt = $conn->prepare("INSERT INTO clients (name, email, phone) VALUES (?, ?, ?)");
            $stmt->bind_param("sss", $name, $email, $phone);
            $stmt->execute();
            $stmt->close();
        } elseif ($action === 'edit' && is_numeric($id)) {
            $stmt = $conn->prepare("UPDATE clients SET name=?, email=?, phone=? WHERE id=?");
            $stmt->bind_param("sssi", $name, $email, $phone, $id);
            $stmt->execute();
            $stmt->close();
        } elseif ($action === 'delete' && is_numeric($id)) {
            $stmt = $conn->prepare("DELETE FROM clients WHERE id=?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $stmt->close();
        }
        header("Location: dashboard.php?page=clients");
        exit;
    }
}

// FINANCIALS CRUD
if ($page === 'financials' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action'])) {
        $action = $_POST['action'];
        $id = $_POST['id'] ?? '';
        $date = $_POST['date'] ?? '';
        $desc = $_POST['description'] ?? '';
        $amount = $_POST['amount'] ?? '';
        $type = $_POST['type'] ?? '';

        if ($action === 'add') {
            $stmt = $conn->prepare("INSERT INTO financials (`date`, description, amount, type) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("ssis", $date, $desc, $amount, $type);
            $stmt->execute();
            $stmt->close();
        } elseif ($action === 'edit' && is_numeric($id)) {
            $stmt = $conn->prepare("UPDATE financials SET `date`=?, description=?, amount=?, type=? WHERE id=?");
            $stmt->bind_param("ssisi", $date, $desc, $amount, $type, $id);
            $stmt->execute();
            $stmt->close();
        } elseif ($action === 'delete' && is_numeric($id)) {
            $stmt = $conn->prepare("DELETE FROM financials WHERE id=?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $stmt->close();
        }
        header("Location: dashboard.php?page=financials");
        exit;
    }
}

// Fetch clients list for page
function fetchClients($conn) {
    $clients = [];
    $sql = "SELECT * FROM clients ORDER BY id DESC";
    $res = $conn->query($sql);
    if ($res) {
        while ($row = $res->fetch_assoc()) {
            $clients[] = $row;
        }
        $res->free();
    }
    return $clients;
}

// Fetch financials list for page
function fetchFinancials($conn) {
    $financials = [];
    $sql = "SELECT * FROM financials ORDER BY date DESC, id DESC";
    $res = $conn->query($sql);
    if ($res) {
        while ($row = $res->fetch_assoc()) {
            $financials[] = $row;
        }
        $res->free();
    }
    return $financials;
}

$clients = fetchClients($conn);
$financials = fetchFinancials($conn);
?>
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>DevNarda Admin Dashboard</title>
<link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet" />
<style>
/* Simplified SB Admin style for admin dashboard */
body {
  font-family: 'Poppins', sans-serif;
  background-color: #f8f9fa;
  margin: 0;
}
body.dark {
  background-color: #121417;
  color: #ddd;
}
#wrapper {
  display: flex;
  min-height: 100vh;
}
#sidebar {
  width: 240px;
  background: #343a40;
  color: #fff;
  flex-shrink: 0;
}
#sidebar h2 {
  padding: 1rem;
  font-weight: 700;
  font-size: 1.5rem;
  border-bottom: 1px solid #495057;
  user-select: none;
}
#sidebar ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
#sidebar ul li {
  border-bottom: 1px solid #495057;
}
#sidebar ul li a {
  display: block;
  padding: 1rem 1.5rem;
  color: #adb5bd;
  text-decoration: none;
  font-weight: 600;
  transition: background 0.3s;
}
#sidebar ul li a.active,
#sidebar ul li a:hover {
  background: #495057;
  color: #fff;
}
#page-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
header.navbar {
  background: #6f42c1;
  padding: 0.75rem 1.5rem;
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.content {
  padding: 1.5rem;
  flex: 1;
  overflow-y: auto;
  background: white;
}
body.dark .content {
  background: #1f2937;
  color: #e0e7ff;
}
.card {
  box-shadow: 0 0 18px rgb(59 130 246 / 0.15);
  margin-bottom: 1.5rem;
}
body.dark .card {
  box-shadow: 0 0 18px rgb(59 130 246 / 0.5);
}
footer {
  padding: 1rem 1.5rem;
  text-align: center;
  background: #f8f9fa;
  font-weight: 500;
  font-size: 0.9rem;
}
body.dark footer {
  background: #121417;
  color: #999;
}

/* Buttons */
.btn-primary {
  background-color: #6f42c1;
  border-color: #6f42c1;
  transition: background-color 0.3s ease;
}
.btn-primary:hover, .btn-primary:focus {
  background-color: #9b72d1;
  border-color: #9b72d1;
}
.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
}
.btn-danger:hover, .btn-danger:focus {
  background-color: #bb2d3b;
  border-color: #bb2d3b;
}

/* Tables */
.table thead th {
  background-color: #6f42c1;
  color: #fff;
}
body.dark .table thead th {
  background-color: #9b72d1;
  color: #eee;
}
.table tbody tr:hover {
  background-color: #e9ecef;
}
body.dark .table tbody tr:hover {
  background-color: #3c1046;
}

/* Forms */
.form-control {
  border-radius: 0.3rem;
}

</style>
</head>
<body<?php if(isset($_SESSION['dark_mode']) && $_SESSION['dark_mode']) echo ' class="dark"'; ?>>
<div id="wrapper">

  <nav id="sidebar">
    <h2>DevNarda Admin</h2>
    <ul>
      <li><a href="dashboard.php?page=dashboard" class="<?php echo $page=='dashboard'?'active':'';?>">Dashboard</a></li>
      <li><a href="dashboard.php?page=clients" class="<?php echo $page=='clients'?'active':'';?>">Clients</a></li>
      <li><a href="dashboard.php?page=financials" class="<?php echo $page=='financials'?'active':'';?>">Financials</a></li>
      <li><a href="dashboard.php?page=chat" class="<?php echo $page=='chat'?'active':'';?>">Chat</a></li>
      <li><a href="dashboard.php?page=settings" class="<?php echo $page=='settings'?'active':'';?>">Settings</a></li>
      <li><a href="logout.php">Logout</a></li>
    </ul>
  </nav>

  <div id="page-content">
    <header class="navbar">
      <div>DevNarda Admin Dashboard</div>
      <div>
        <form method="post" style="display:inline;">
          <button type="submit" name="toggle_dark" class="btn btn-primary btn-sm">Toggle Dark Mode</button>
        </form>
      </div>
    </header>
    <main class="content">
      <?php
      if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['toggle_dark'])) {
          $_SESSION['dark_mode'] = !($_SESSION['dark_mode'] ?? false);
          header("Location: dashboard.php?page=$page");
          exit;
      }

      if($page == 'dashboard'):
      ?>
        <h3>Welcome, <?php echo htmlspecialchars($_SESSION['username']); ?></h3>
        <div class="card p-3">
          <h4>Basic Stats</h4>
          <ul>
            <li>Active Users: 100 (example)</li>
            <li>Orders Today: 15 (example)</li>
            <li>Revenue Today: Rp 10,000,000 (example)</li>
          </ul>
        </div>

        <div class="card p-3">
          <h4>Charts will go here</h4>
          <p>Implement charts with Chart.js or similar.</p>
        </div>
      <?php
      elseif($page == 'clients'):
      ?>
        <h3>Clients Management</h3>
        <p>Implement CRUD for clients here.</p>
        <!-- Dummy Clients Table -->
        <table class="table table-striped table-bordered">
          <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Actions</th></tr></thead>
          <tbody>
            <tr><td>1</td><td>Client 1</td><td>client1@example.com</td><td>0812345678</td><td><button class="btn btn-sm btn-primary">Edit</button> <button class="btn btn-sm btn-danger">Delete</button></td></tr>
          </tbody>
        </table>
      <?php
      elseif($page == 'financials'):
      ?>
        <h3>Financial Management</h3>
        <p>Implement CRUD for transactions here.</p>
        <!-- Dummy Table -->
        <table class="table table-striped table-bordered">
          <thead><tr><th>ID</th><th>Date</th><th>Description</th><th>Amount</th><th>Type</th><th>Actions</th></tr></thead>
          <tbody>
            <tr><td>1</td><td>2024-06-01</td><td>Invoice #123</td><td>Rp 5,000,000</td><td>Income</td><td><button class="btn btn-sm btn-primary">Edit</button> <button class="btn btn-sm btn-danger">Delete</button></td></tr>
          </tbody>
        </table>
      <?php
      elseif($page == 'chat'):
      ?>
        <h3>Chat</h3>
        <p>Chat interface here. Can integrate WebSocket or simulated chat.</p>
      <?php
      elseif($page == 'settings'):
      ?>
        <h3>Settings</h3>
        <form method="post">
          <button class="btn btn-primary" type="submit" name="toggle_dark">Toggle Dark Mode</button>
        </form>
      <?php
      else:
        echo "<h3>Page not found</h3>";
      endif;
      ?>
    </main>
  </div>

</div>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
  // You can add more JS to support chart rendering and interactions
</script>

</body>
</html>
