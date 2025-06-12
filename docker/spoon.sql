SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS scoop
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE scoop;

CREATE TABLE categoria_restaurante
(
    id     INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
)
    COLLATE = utf8mb4_unicode_ci;

CREATE TABLE doctrine_migration_versions
(
    version        VARCHAR(191) NOT NULL PRIMARY KEY,
    executed_at    DATETIME     NULL,
    execution_time INT          NULL
)
    COLLATE = utf8mb3_unicode_ci;

CREATE TABLE messenger_messages
(
    id           BIGINT AUTO_INCREMENT PRIMARY KEY,
    body         LONGTEXT     NOT NULL,
    headers      LONGTEXT     NOT NULL,
    queue_name   VARCHAR(190) NOT NULL,
    created_at   DATETIME     NOT NULL COMMENT '(DC2Type:datetime_immutable)',
    available_at DATETIME     NOT NULL COMMENT '(DC2Type:datetime_immutable)',
    delivered_at DATETIME     NULL COMMENT '(DC2Type:datetime_immutable)'
)
    COLLATE = utf8mb4_unicode_ci;

CREATE INDEX IDX_75EA56E016BA31DB ON messenger_messages (delivered_at);
CREATE INDEX IDX_75EA56E0E3BD61CE ON messenger_messages (available_at);
CREATE INDEX IDX_75EA56E0FB7336F0 ON messenger_messages (queue_name);

CREATE TABLE restaurante
(
    id           INT AUTO_INCREMENT PRIMARY KEY,
    nombre       VARCHAR(100) NOT NULL,
    descripcion  LONGTEXT     NOT NULL,
    longitud     DOUBLE       NOT NULL,
    latitud      DOUBLE       NOT NULL,
    categoria_id INT          NULL,
    img          LONGTEXT     NOT NULL,
    CONSTRAINT FK_5957C2753397707A FOREIGN KEY (categoria_id) REFERENCES categoria_restaurante (id)
)
    COLLATE = utf8mb4_unicode_ci;

CREATE INDEX IDX_5957C2753397707A ON restaurante (categoria_id);

CREATE TABLE usuario
(
    id            INT AUTO_INCREMENT PRIMARY KEY,
    email         VARCHAR(120) NOT NULL,
    password      VARCHAR(255) NOT NULL,
    user          VARCHAR(255) NOT NULL,
    birthdate     DATE         NOT NULL,
    profile_image LONGTEXT     NULL,
    banner_image  LONGTEXT     NULL
)
    COLLATE = utf8mb4_unicode_ci;

CREATE TABLE favoritos
(
    id             INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id     INT NOT NULL,
    restaurante_id INT NULL,
    CONSTRAINT FK_1E86887F38B81E49 FOREIGN KEY (restaurante_id) REFERENCES restaurante (id),
    CONSTRAINT FK_1E86887FA76ED395 FOREIGN KEY (usuario_id) REFERENCES usuario (id)
)
    COLLATE = utf8mb4_unicode_ci;

CREATE INDEX IDX_1E86887F38B81E49 ON favoritos (restaurante_id);
CREATE INDEX IDX_1E86887FA76ED395 ON favoritos (usuario_id);

CREATE TABLE reserva
(
    id             INT AUTO_INCREMENT PRIMARY KEY,
    fecha_reserva  DATE  NOT NULL,
    hora_reserva   TIME  NOT NULL,
    num_personas   INT   NOT NULL,
    restaurante_id INT   NULL,
    usuario_id     INT   NULL,
    descuento      FLOAT NOT NULL,
    CONSTRAINT FK_188D2E3B38B81E49 FOREIGN KEY (restaurante_id) REFERENCES restaurante (id),
    CONSTRAINT FK_188D2E3BA76ED395 FOREIGN KEY (usuario_id) REFERENCES usuario (id)
)
    COLLATE = utf8mb4_unicode_ci;

CREATE INDEX IDX_188D2E3B38B81E49 ON reserva (restaurante_id);
CREATE INDEX IDX_188D2E3BA76ED395 ON reserva (usuario_id);

CREATE TABLE valoracion
(
    id             INT AUTO_INCREMENT PRIMARY KEY,
    comentario     LONGTEXT NOT NULL,
    puntuacion     INT      NOT NULL,
    restaurante_id INT      NULL,
    usuario_id     INT      NULL,
    CONSTRAINT FK_6D3DE0F438B81E49 FOREIGN KEY (restaurante_id) REFERENCES restaurante (id),
    CONSTRAINT FK_6D3DE0F4A76ED395 FOREIGN KEY (usuario_id) REFERENCES usuario (id)
)
    COLLATE = utf8mb4_unicode_ci;

CREATE INDEX IDX_6D3DE0F438B81E49 ON valoracion (restaurante_id);
CREATE INDEX IDX_6D3DE0F4A76ED395 ON valoracion (usuario_id);

INSERT INTO categoria_restaurante (id, nombre)
VALUES (1, 'Comida Rapida'),
       (2, 'Mexicana'),
       (3, 'Española'),
       (4, 'Italiana'),
       (5, 'Japonesa'),
       (6, 'China'),
       (7, 'Mediterránea'),
       (8, 'Vegetariana'),
       (9, 'India'),
       (10, 'Gourmet');


INSERT INTO restaurante (id, nombre, longitud, latitud, categoria_id, descripcion, img)
VALUES (1, 'Budare Venezuelan Food', -4.4212112, 36.7222054, 10,
        'Un restaurante que ofrece una experiencia culinaria venezolana auténtica, con platos típicos como arepas, empanadas y pabellón.',
        'img/1budareVenezuelan.jpg'),
       (2, 'Dynamit', -4.4235169, 36.7247954, 7,
        'Conocido por su ambiente moderno y vibrante, ofrece una variedad de platos que combinan sabores internacionales con toques locales.',
        'img/2dynamit.jpg'),
       (3, 'Caranava', -4.4220382, 36.72256, 2,
        'Un lugar acogedor que destaca por su gastronomía inspirada en la cocina venezolana, ideal para disfrutar de una buena comida en un entorno familiar.',
        'img/3caravana.png'),
       (4, 'Trattoria Mamma Franca', -4.4582107, 36.6832576, 4,
        'Restaurante italiano que ofrece auténtica pasta fresca y otros clásicos de la cocina italiana, en un ambiente cálido y acogedor.',
        'img/4trattoria.jpg'),
       (5, 'Araboka Plaza', -4.4368139, 36.7182429, 10,
        'Un restaurante que fusiona sabores árabes y mediterráneos, ofreciendo una variedad de platos llenos de especias y tradición.',
        'img/5araboka.jpg'),
       (6, 'Arrebato Gastrotaberna', -4.4211502, 36.7241648, 3,
        'Un concepto innovador que combina la taberna tradicional con un enfoque gourmet, ofreciendo tapas creativas y platos elaborados.',
        'img/6arrebato.jpg'),
       (7, 'El Rincon de Lola', -4.4395668, 36.7051022, 3,
        'Un lugar familiar que ofrece comida casera con sabores malagueños y andaluces, perfecto para disfrutar de una comida reconfortante.',
        'img/7rinconLola.jpg'),
       (8, 'Alegría Flamenco y Gastronomía', -4.4140352, 36.7184109, 3,
        'Combina la tradición del flamenco con la gastronomía, ofreciendo espectáculos en vivo junto con una carta de platos típicos españoles.',
        'img/8alregriaGastrobar.jpg'),
       (9, 'Mezcal Gastrobar', -4.4235058, 36.7204814, 10,
        'Un gastrobar que destaca por su selección de mezcales y cócteles, ofreciendo una experiencia de bebida única con tapas de fusión.',
        'img/9mezcalGastrobar.jpg'),
       (10, 'Spago''s Pasta Fresca', -4.4231817, 36.7224547, 4,
        'Especializado en pasta fresca hecha a mano, este restaurante ofrece una variedad de salsas y platos italianos en un ambiente acogedor.',
        'img/10spagos.jpg'),
       (11, 'Amigos Plaza Mayor', -4.4815046, 36.6574357, 9,
        'Restaurante familiar que ofrece una amplia variedad de platos internacionales y locales, ideal para grupos y celebraciones.',
        'img/11amigosPlaza.jpg'),
       (12, 'Sibuya Ubar Sushi Bar', -4.4980406, 36.73452, 5,
        'Un bar de sushi que destaca por su fusión de sabores y la frescura de sus ingredientes, perfecto para los amantes de la cocina japonesa.',
        'img/12sibuya.jpg'),
       (13, 'Base9', -4.4316272, 36.7138872, 10,
        'Un espacio contemporáneo que combina un ambiente relajado con una oferta gastronómica variada, ideal para disfrutar de tapas y cócteles.',
        'img/13base9.jpg'),
       (14, 'Anyway Wine Bar', -4.4148816, 36.7173747, 10,
        'Un bar de vinos que ofrece una cuidada selección de vinos nacionales e internacionales, junto con tapas gourmet para maridar.',
        'img/14anywayWine.jpg'),
       (15, '3 Reggimiento Pirata', -4.4338025, 36.7182377, 4,
        'Restaurante que ofrece una experiencia divertida con un ambiente pirata, ideal para disfrutar de tapas y platos creativos.',
        'img/15reggimientoPizza.jpg'),
       (16, 'Ultramarinos Benjamin', -4.4236211, 36.7196167, 7,
        'Un restaurante y tienda que combina lo mejor de la gastronomía local con productos gourmet, ofreciendo platos típicos malagueños.',
        'img/16ultramarinosBenjamin.jpg'),
       (17, 'Cocktail Bar La Mamba', -4.4220845, 36.7236844, 10,
        'Un bar de cócteles con una atmósfera relajada y creativa, ideal para disfrutar de bebidas únicas y tapas.',
        'img/17cocktailMamba.jpg'),
       (18, 'La Proa de Teatinos', -4.4821819, 36.7226978, 7,
        'Especializado en mariscos frescos y platos del mar, este restaurante ofrece una experiencia culinaria costera en un ambiente familiar.',
        'img/18proaTeatinos.jpg'),
       (19, 'Lalos''s Burguer', -4.4797917, 36.7228163, 1,
        'Un lugar famoso por sus hamburguesas gourmet, ofreciendo una variedad de opciones creativas y un ambiente casual y divertido.',
        'img/19lalosBurguer.jpg'),
       (20, 'Meet Vegano', -4.4251399, 36.7192542, 8,
        'Un restaurante vegano que ofrece una variedad de platos saludables y deliciosos, ideales para quienes buscan opciones sin ingredientes de origen animal.',
        'img/20meetVegano.jpg');
