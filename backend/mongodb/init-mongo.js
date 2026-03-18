db = db.getSiblingDB('toyota_catalogo');
if (db.productos.countDocuments() === 0) {
  db.productos.insertMany([
    {nombre:'Samsung Galaxy S24 Ultra',marca:'Samsung',modelo:'S24 Ultra',precio:4500000,precioAnterior:5000000,stock:15,categoria:'Celulares',activo:true,fechaCreacion:new Date()},
    {nombre:'iPhone 15 Pro Max',marca:'Apple',modelo:'15 Pro Max',precio:5800000,precioAnterior:6200000,stock:8,categoria:'Celulares',activo:true,fechaCreacion:new Date()},
    {nombre:'Xiaomi Redmi Note 13 Pro',marca:'Xiaomi',modelo:'Redmi Note 13 Pro',precio:1200000,precioAnterior:1500000,stock:25,categoria:'Celulares',activo:true,fechaCreacion:new Date()},
    {nombre:'MacBook Pro 14 M3',marca:'Apple',modelo:'MacBook Pro 14',precio:8500000,precioAnterior:9000000,stock:5,categoria:'Computadores',activo:true,fechaCreacion:new Date()},
    {nombre:'Dell XPS 15',marca:'Dell',modelo:'XPS 15 9530',precio:6200000,precioAnterior:6800000,stock:7,categoria:'Computadores',activo:true,fechaCreacion:new Date()}
  ]);
  print('Productos inicializados: ' + db.productos.countDocuments());
}
