CREATE TABLE IF NOT EXISTS usuarios (
    "Id" text NOT NULL PRIMARY KEY,
    "UserName" character varying(256),
    "NormalizedUserName" character varying(256),
    "Email" character varying(256),
    "NormalizedEmail" character varying(256),
    "EmailConfirmed" boolean NOT NULL,
    "PasswordHash" text,
    "SecurityStamp" text,
    "ConcurrencyStamp" text,
    "PhoneNumber" text,
    "PhoneNumberConfirmed" boolean NOT NULL,
    "TwoFactorEnabled" boolean NOT NULL,
    "LockoutEnd" timestamp with time zone,
    "LockoutEnabled" boolean NOT NULL,
    "AccessFailedCount" integer NOT NULL,
    "FullName" text
);
CREATE TABLE IF NOT EXISTS roles (
    "Id" text NOT NULL PRIMARY KEY,
    "Name" character varying(256),
    "NormalizedName" character varying(256),
    "ConcurrencyStamp" text
);
CREATE TABLE IF NOT EXISTS usuarios_roles (
    "UserId" text NOT NULL,
    "RoleId" text NOT NULL,
    PRIMARY KEY ("UserId", "RoleId")
);

CREATE TABLE IF NOT EXISTS pagos (
    "Id" SERIAL PRIMARY KEY,
    "PedidoId" integer NOT NULL,
    "Monto" numeric(18,2) NOT NULL,
    "Estado" character varying(50) NOT NULL DEFAULT 'Aprobado',
    "Fecha" timestamp with time zone NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS pedidos (
    "Id" SERIAL PRIMARY KEY,
    "Cliente" character varying(200) NOT NULL,
    "Total" numeric(18,2) NOT NULL,
    "Fecha" timestamp with time zone NOT NULL DEFAULT NOW(),
    "Email" character varying(200) NOT NULL DEFAULT '',
    "Telefono" character varying(50) NOT NULL DEFAULT '',
    "Nombre" character varying(100) NOT NULL DEFAULT '',
    "Apellido" character varying(100) NOT NULL DEFAULT '',
    "Empresa" character varying(200) NOT NULL DEFAULT '',
    "Ciudad" character varying(100) NOT NULL DEFAULT '',
    "Direccion" character varying(300) NOT NULL DEFAULT '',
    "Barrio" character varying(100) NOT NULL DEFAULT '',
    "TipoId" character varying(10) NOT NULL DEFAULT '',
    "NumeroId" character varying(50) NOT NULL DEFAULT '',
    "MetodoEnvio" character varying(50) NOT NULL DEFAULT 'domicilio',
    "MetodoPago" character varying(50) NOT NULL DEFAULT 'tarjeta',
    "ItemsJson" text NOT NULL DEFAULT '[]',
    "Estado" character varying(50) NOT NULL DEFAULT 'Completado'
);
