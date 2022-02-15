CREATE TABLE `m_currency_rates_lock` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `unique_key` varchar(100) NOT NULL UNIQUE,
  `from_currency` varchar(5) NOT NULL,
  `to_currency` varchar(5) NOT NULL,
  `rate` decimal(19,6) NOT NULL DEFAULT '0.000000',
  `expire_by` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ;