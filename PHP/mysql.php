<?php 
  $config = array(
    'database' => array(
      'host' => 'localhost',
      'username' => 'root',
      'password' => '',
      'database' => 'fonasa',
      'encoding' => 'utf8'
    ),
  );

  function Connect($config = array()){
    $conn = mysqli_connect(
      $config['host'],
      $config['username'],
      $config['password'],
      $config['database']
    );
    mysqli_set_charset($conn, $config['encoding']);
    return ($conn);
  }

  function Execute($sql, $conn){
    $result = mysqli_query($conn, $sql);
    return $result;
  }

  function ExecuteQuery($sql, $conn){
    $result = mysqli_query($conn, $sql);
    if ($row = mysqli_fetch_array($result, MYSQLI_BOTH)){
      do {
        $data[] = $row;
      } while ($row = mysqli_fetch_array($result, MYSQLI_BOTH));
    } else {
      $data = null;
    }
    mysqli_free_result($result);
    return ($data);
  }
?>