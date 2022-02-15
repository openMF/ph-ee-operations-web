CREATE TABLE `m_currency_rates` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `from_currency` varchar(5) NOT NULL,
  `to_currency` varchar(5) NOT NULL,
  `rate` decimal(19,6) NOT NULL DEFAULT '0.000000',
  `last_updated` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `exchange_UNIQUE` (`from_currency` ,`to_currency`)
);