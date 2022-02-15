ALTER TABLE `m_staff`
ADD COLUMN `image_id` BIGINT(20) NULL,
ADD CONSTRAINT `FK_m_staff_m_image` FOREIGN KEY (`image_id`) REFERENCES `m_image` (`id`);

ALTER TABLE `m_password_validation_policy` ADD COLUMN `key` VARCHAR(255) NOT NULL;

UPDATE `m_password_validation_policy` pvp SET pvp.`key`='simple' where pvp.id='1' ;
UPDATE `m_password_validation_policy` pvp SET pvp.`key`='secure' where pvp.id='2' ;

ALTER TABLE m_group ADD COLUMN `account_no` VARCHAR(20) NOT NULL;
UPDATE m_group set account_no = lpad(id,9,0);

ALTER TABLE `m_code_value` ADD COLUMN `is_active` TINYINT(1) NOT NULL DEFAULT '1' AFTER `code_score`;

alter table `m_code_value` add `is_mandatory` tinyint(1) not null default '0';
