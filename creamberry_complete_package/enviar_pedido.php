<?php
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo 'Método no permitido'; exit; }
$destino = 'contacto.creamberry@gmail.com';
$nombre = isset($_POST['clienteNombre']) ? strip_tags(trim($_POST['clienteNombre'])) : '';
$telefono = isset($_POST['clienteTelefono']) ? strip_tags(trim($_POST['clienteTelefono'])) : '';
$tipoEnvio = isset($_POST['tipoEnvio']) ? strip_tags(trim($_POST['tipoEnvio'])) : '';
$direccion = isset($_POST['clienteDireccion']) ? strip_tags(trim($_POST['clienteDireccion'])) : '';
$observaciones = isset($_POST['observaciones']) ? strip_tags(trim($_POST['observaciones'])) : '';
$cartJson = isset($_POST['cart']) ? $_POST['cart'] : '[]';
$cart = json_decode($cartJson, true); if (!is_array($cart)) $cart = [];
$total = 0; $detalle = "";
foreach ($cart as $item) {
  $cantidad = isset($item['qty']) ? (int)$item['qty'] : 0;
  $precio = isset($item['price']) ? (float)$item['price'] : 0;
  $nombreItem = isset($item['name']) ? $item['name'] : '';
  $subtotal = $cantidad * $precio; $total += $subtotal;
  $detalle .= "{$cantidad} x {$nombreItem} - $" . number_format($subtotal, 2, ',', '.') . "
";
}
$body = "Nuevo pedido desde Creamberry:

";
$body .= "Nombre: {$nombre}
";
$body .= "Teléfono: {$telefono}
";
$body .= "Tipo de entrega: {$tipoEnvio}
";
if (!empty($direccion)) $body .= "Dirección: {$direccion}
";
$body .= "Observaciones: {$observaciones}

";
$body .= "Detalle del pedido:
";
$body .= $detalle;
$body .= "
Total: $" . number_format($total, 2, ',', '.') . "
";
$headers = "From: pedidos@creamberry.local
Reply-To: pedidos@creamberry.local
Content-Type: text/plain; charset=UTF-8
";
$sent = @mail($destino, 'Nuevo pedido - Creamberry', $body, $headers);
?><!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Pedido - Creamberry</title><link rel="stylesheet" href="styles.css"></head><body><main style="padding:40px;text-align:center;"><?php if($sent): ?><h1>Pedido enviado con éxito 🎉</h1><p>Gracias, revisaremos tu pedido y te contactaremos.</p><p><a href="index.html">Volver</a></p><?php else: ?><h1>No se pudo enviar automáticamente</h1><p>Si tu servidor no permite mail(), utiliza el siguiente contenido para enviarlo manualmente a contacto.creamberry@gmail.com</p><pre style="text-align:left;margin:20px auto;max-width:700px;background:#fff;padding:12px;border-radius:8px;"><?php echo htmlspecialchars($body); ?></pre><p><a href="mailto:contacto.creamberry@gmail.com?subject=Nuevo%20pedido%20-%20Creamberry&body=<?php echo rawurlencode($body); ?>">Enviar por correo</a></p><p><a href="index.html">Volver</a></p><?php endif; ?></main></body></html>