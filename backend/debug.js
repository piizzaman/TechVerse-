const { Prisma } = require("@prisma/client");

console.log(
  Prisma.dmmf.datamodel.models.find((m) => m.name === "Product")
);