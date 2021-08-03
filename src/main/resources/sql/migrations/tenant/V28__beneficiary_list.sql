CREATE TABLE `m_beneficiary` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `c_identifier` varchar(100) NOT NULL,
  `b_name` varchar(100) DEFAULT NULL,
  `b_nick_name` varchar(100) DEFAULT NULL,
  `b_identifier` varchar(100) DEFAULT NULL,
  `b_account_no` varchar(100) DEFAULT NULL,
  `b_leId` varchar(100) DEFAULT NULL,
  `b_currency_code` varchar(100) DEFAULT NULL,
  `b_country_code` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `beneficiary_UNIQUE` (`c_identifier`,`b_identifier`)
);