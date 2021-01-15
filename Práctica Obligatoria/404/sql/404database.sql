-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 13-01-2021 a las 23:41:42
-- Versión del servidor: 10.4.16-MariaDB
-- Versión de PHP: 7.4.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `404database`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pregunta`
--

CREATE TABLE `pregunta` (
  `id_pregunta` int(20) NOT NULL,
  `id_correo` varchar(40) NOT NULL,
  `titulo` varchar(200) NOT NULL,
  `cuerpo` varchar(2000) NOT NULL,
  `visitas` int(10) NOT NULL DEFAULT 0,
  `votos_positivos` int(10) NOT NULL DEFAULT 0,
  `votos_negativos` int(10) NOT NULL DEFAULT 0,
  `fecha` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `pregunta`
--

INSERT INTO `pregunta` (`id_pregunta`, `id_correo`, `titulo`, `cuerpo`, `visitas`, `votos_positivos`, `votos_negativos`, `fecha`) VALUES
(1, 'nico@404.es', '¿Cual es la diferencia entre position: relative, position: absolute y position: fixed?', 'Sé que estas propiedades de CSS sirven para posicionar un elemento dentro de la página. Sé que estas propiedades de CSS sirven para posicionar un elemento dentro de la página.', 0, 0, 0, '14/1/2021'),
(2, 'roberto@404.es', '¿Cómo funciona exactamente nth-child?', 'No acabo de comprender muy bien que hace exactamente y qué usos prácticos puede tener.', 0, 0, 0, '14/1/2021'),
(3, 'sfg@404.es', 'Diferencias entre == y === (comparaciones en JavaScript)', 'Siempre he visto que en JavaScript hay:\r\n\r\nasignaciones =\r\ncomparaciones == y ===\r\nCreo entender que == hace algo parecido a comparar el valor de la variable y el === también\r\ncompara el tipo (como un equals de java).', 0, 0, 0, '14/1/2021'),
(4, 'marta@404.es', 'Problema con asincronismo en Node', 'Soy nueva en Node... Tengo una modulo que conecta a una BD de postgres por medio de pg-node. En eso no tengo problemas. Mi problema es que al llamar a ese modulo, desde otro modulo, y despues querer usar los datos que salieron de la BD me dice undefined... Estoy casi seguro que es porque la conexion a la BD devuelve una promesa, y los datos no estan disponibles al momento de usarlos.', 0, 0, 0, '14/1/2021'),
(5, 'lucas@404.es', '¿Qué es la inyección SQL y cómo puedo evitarla?', 'He encontrado bastantes preguntas en StackOverflow sobre programas o formularios web que guardan información en una base de datos (especialmente en PHP y MySQL) y que contienen graves problemas de seguridad relacionados principalmente con la inyección SQL.\r\n\r\nNormalmente dejo un comentario y/o un enlace a una referencia externa, pero un comentario no da mucho espacio para mucho y sería positivo que hubiera una referencia interna en SOes sobre el tema así que decidí escribir esta pregunta.', 0, 0, 0, '14/1/2021');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `respuesta`
--

CREATE TABLE `respuesta` (
  `id_pregunta` int(20) NOT NULL,
  `id_correo` varchar(40) NOT NULL,
  `id_respuesta` int(20) NOT NULL,
  `cuerpo` varchar(2000) NOT NULL,
  `votos_positivos` int(10) NOT NULL DEFAULT 0,
  `votos_negativos` int(10) NOT NULL DEFAULT 0,
  `fecha` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `respuesta`
--

INSERT INTO `respuesta` (`id_pregunta`, `id_correo`, `id_respuesta`, `cuerpo`, `votos_positivos`, `votos_negativos`, `fecha`) VALUES
(1, 'lucas@404.es', 1, 'La propiedad position sirve para posicionar un elemento dentro de la página. Sin embargo, dependiendo de cual sea la propiedad que usemos, el elemento tomará una referencia u otra para posicionarse respecto a ella.\r\n\r\nLos posibles valores que puede adoptar la propiedad position son: static | relative | absolute | fixed | inherit | initial.\r\n', 0, 0, '14/1/2021'),
(2, 'emy@404.es', 2, 'La pseudoclase :nth-child() selecciona los hermanos que cumplan cierta condición definida en la fórmula an + b. a y b deben ser números enteros, n es un contador. El grupo an representa un ciclo, cada cuantos elementos se repite; b indica desde donde empezamos a contar.', 0, 0, '14/1/2021');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sessions`
--

CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) UNSIGNED NOT NULL,
  `data` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tema`
--

CREATE TABLE `tema` (
  `id_pregunta` int(20) NOT NULL,
  `nombre_tema` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `tema`
--

INSERT INTO `tema` (`id_pregunta`, `nombre_tema`) VALUES
(1, 'css'),
(1, 'css3'),
(2, 'css'),
(2, 'html'),
(3, 'JavaScript'),
(4, 'nodejs'),
(5, 'mysql'),
(5, 'sql');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `nombre` varchar(15) NOT NULL,
  `correo` varchar(40) NOT NULL,
  `contraseña` varchar(30) NOT NULL,
  `foto_perfil` varchar(50) NOT NULL,
  `fecha_registro` varchar(10) NOT NULL,
  `reputacion` int(10) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`nombre`, `correo`, `contraseña`, `foto_perfil`, `fecha_registro`, `reputacion`) VALUES
('Emy', 'emy@404.es', '1234', 'emy.png', '14/1/2021', 1),
('Lucas', 'lucas@404.es', '1234', 'defecto3.png', '14/1/2021', 1),
('Marta', 'marta@404.es', '1234', 'marta.png', '14/1/2021', 1),
('Nico', 'nico@404.es', '1234', 'nico.png', '14/1/2021', 1),
('Roberto', 'roberto@404.es', '1234', 'roberto.png', '14/1/2021', 1),
('SFG', 'sfg@404.es', '1234', 'sfg.png', '14/1/2021', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vota`
--

CREATE TABLE `vota` (
  `id_pregunta` int(20) DEFAULT NULL,
  `id_respuesta` int(20) DEFAULT NULL,
  `correo` varchar(40) NOT NULL,
  `votado` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `pregunta`
--
ALTER TABLE `pregunta`
  ADD PRIMARY KEY (`id_pregunta`),
  ADD KEY `usuario-pregunta` (`id_correo`);

--
-- Indices de la tabla `respuesta`
--
ALTER TABLE `respuesta`
  ADD PRIMARY KEY (`id_respuesta`),
  ADD KEY `pregunta_respuesta` (`id_pregunta`),
  ADD KEY `usuario_respuesta` (`id_correo`);

--
-- Indices de la tabla `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`session_id`);

--
-- Indices de la tabla `tema`
--
ALTER TABLE `tema`
  ADD PRIMARY KEY (`id_pregunta`,`nombre_tema`),
  ADD KEY `pregunta_tema` (`id_pregunta`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`correo`);

--
-- Indices de la tabla `vota`
--
ALTER TABLE `vota`
  ADD KEY `usuario_vota` (`correo`),
  ADD KEY `pregunta_votada` (`id_pregunta`),
  ADD KEY `respuesta_votada` (`id_respuesta`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `pregunta`
--
ALTER TABLE `pregunta`
  MODIFY `id_pregunta` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `respuesta`
--
ALTER TABLE `respuesta`
  MODIFY `id_respuesta` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `pregunta`
--
ALTER TABLE `pregunta`
  ADD CONSTRAINT `usuario-pregunta` FOREIGN KEY (`id_correo`) REFERENCES `usuario` (`correo`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `respuesta`
--
ALTER TABLE `respuesta`
  ADD CONSTRAINT `pregunta_respuesta` FOREIGN KEY (`id_pregunta`) REFERENCES `pregunta` (`id_pregunta`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `usuario_respuesta` FOREIGN KEY (`id_correo`) REFERENCES `usuario` (`correo`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `tema`
--
ALTER TABLE `tema`
  ADD CONSTRAINT `pregunta_tema` FOREIGN KEY (`id_pregunta`) REFERENCES `pregunta` (`id_pregunta`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `vota`
--
ALTER TABLE `vota`
  ADD CONSTRAINT `pregunta_votada` FOREIGN KEY (`id_pregunta`) REFERENCES `pregunta` (`id_pregunta`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `respuesta_votada` FOREIGN KEY (`id_respuesta`) REFERENCES `respuesta` (`id_respuesta`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `usuario_vota` FOREIGN KEY (`correo`) REFERENCES `usuario` (`correo`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
