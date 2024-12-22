import express from "express";
import { sequelize, QueryTypes } from "../config/db.js";
import authenticate from "../middlewares/authMiddleware.js";

const productosRouter = express.Router();

const validFields = [
  "nombre",
  "CategoriaProductos_idCategoriaProductos",
  "usuarios_idusuarios",
  "marca",
  "codigo",
  "stock",
  "estados_idestados",
  "precio",
  "foto",
];

productosRouter.post("/", authenticate ,async (req, res) => {
  try {
    const requestBody = req.body;

    const invalidFields = Object.keys(requestBody).filter(
      (field) => !validFields.includes(field)
    );
    if (invalidFields.length > 0) {
      return res.status(400).json({
        message: `Campos inválidos: ${invalidFields.join(", ")}.`,
      });
    }

    const requiredFields = [
      "nombre",
      "CategoriaProductos_idCategoriaProductos",
      "usuarios_idusuarios",
      "marca",
      "codigo",
      "stock",
      "estados_idestados",
      "precio",
      "foto"
    ];
    const missingFields = requiredFields.filter((field) => !(field in requestBody));
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Faltan campos requeridos: ${missingFields.join(", ")}.`,
      });
    }

    const {
      nombre,
      CategoriaProductos_idCategoriaProductos,
      usuarios_idusuarios,
      marca,
      codigo,
      stock,
      estados_idestados,
      precio,
      fecha_creacion,
      foto,
    } = requestBody;

    let fotoBuffer = null;
    if (foto) {
      if (typeof foto === "string") {
        fotoBuffer = Buffer.from(foto.split(",")[1] || foto, "base64");
      } else {
        return res.status(400).json({
          message: "El formato del campo 'foto' no es válido. Debe ser base64.",
        });
      }
    }
    const fechaEntregaFormatted = new Date(fecha_creacion).toISOString().slice(0, 10).replace('T', ' ')

    const result = await sequelize.query(
      `EXEC InsertarProducto 
        @CategoriaProductos_idCategoriaProductos = :CategoriaProductos_idCategoriaProductos,
        @usuarios_idusuarios = :usuarios_idusuarios,
        @nombre = :nombre,
        @marca = :marca,
        @codigo = :codigo,
        @stock = :stock,
        @estados_idestados = :estados_idestados,
        @precio = :precio,
        @fecha_creacion = :fecha_creacion,
        @foto = :foto`,
      {
        replacements: {
          CategoriaProductos_idCategoriaProductos,
          usuarios_idusuarios,
          nombre,
          marca,
          codigo,
          stock,
          estados_idestados,
          precio,
          fecha_creacion : fechaEntregaFormatted,
          foto: fotoBuffer,
        },
        type: QueryTypes.RAW,
      }
    );

    res.status(201).json({ message: "Producto insertado correctamente." });
  } catch (err) {
    console.error("Error al insertar el producto:", err);
    res.status(500).json({ message: "Error al insertar el producto." });
  }
});
productosRouter.put("/:idProductos", authenticate ,async (req, res) => {
  const requestBody = req.body;
  const { idProductos } = req.params; 

  const requiredFields = ["CategoriaProductos_idCategoriaProductos", "usuarios_idusuarios", "nombre", "marca", "codigo", "stock", "estados_idestados", "precio", "foto"];
  const missingFields = requiredFields.filter((field) => !requestBody[field]);

  const invalidFields = Object.keys(requestBody).filter(
    (field) => !validFields.includes(field)
  );
  if (invalidFields.length > 0) {
    return res.status(400).json({
      message: `Campos inválidos: ${invalidFields.join(", ")}.`,
    });
  }

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: `Faltan campos requeridos: ${missingFields.join(", ")}.`,
    });
  }

  const {
    nombre,
    CategoriaProductos_idCategoriaProductos,
    usuarios_idusuarios,
    marca,
    codigo,
    stock,
    estados_idestados,
    precio,
    foto, 
  } = requestBody;

  let fotoBuffer = null;
  if (foto) {
    if (typeof foto === "string") {
      fotoBuffer = Buffer.from(foto.split(",")[1] || foto, "base64");
    } else {
      return res.status(400).json({
        message: "El formato del campo 'foto' no es válido. Debe ser base64.",
      });
    }
  }

  try {
    const result = await sequelize.query(
      `EXEC ActualizarProducto 
        @idProductos = :idProductos, 
        @CategoriaProductos_idCategoriaProductos = :CategoriaProductos_idCategoriaProductos,
        @usuarios_idusuarios = :usuarios_idusuarios, 
        @nombre = :nombre, 
        @marca = :marca, 
        @codigo = :codigo, 
        @stock = :stock, 
        @estados_idestados = :estados_idestados, 
        @precio = :precio, 
        @foto = :foto`,
      {
        replacements: {
          idProductos: idProductos,
          CategoriaProductos_idCategoriaProductos,
          usuarios_idusuarios,
          nombre,
          marca,
          codigo,
          stock,
          estados_idestados,
          precio,
          foto: fotoBuffer,
        },
        type: QueryTypes.RAW,
      }
    );
    if (result[1] === 0) {
      return res.status(404).json({ message: "Producto no encontrado." });
  }

  res.status(200).json({ message: "Producto actualizado correctamente." });
  } catch (err) {
  console.error("Error al actualizar el producto:", err);
  res.status(500).json({ message: "Error al actualizar el producto." });
  }
});

export default productosRouter;
