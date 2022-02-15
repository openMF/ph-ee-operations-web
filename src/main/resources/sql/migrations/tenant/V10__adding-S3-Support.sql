--
-- Licensed to the Apache Software Foundation (ASF) under one
-- or more contributor license agreements. See the NOTICE file
-- distributed with this work for additional information
-- regarding copyright ownership. The ASF licenses this file
-- to you under the Apache License, Version 2.0 (the
-- "License"); you may not use this file except in compliance
-- with the License. You may obtain a copy of the License at
--
-- http://www.apache.org/licenses/LICENSE-2.0
--
-- Unless required by applicable law or agreed to in writing,
-- software distributed under the License is distributed on an
-- "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
-- KIND, either express or implied. See the License for the
-- specific language governing permissions and limitations
-- under the License.
--

/*Image tables stores details of all images*/
CREATE TABLE IF NOT EXISTS `m_image`(
	`id` BIGINT(20) NOT NULL AUTO_INCREMENT,
	`location` varchar(500),
	`storage_type_enum` SMALLINT(5),
	PRIMARY KEY (`id`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB;

/*Add storage type for m_document table and update existing documents to file storage*/
ALTER TABLE m_document ADD COLUMN storage_type_enum SMALLINT(5);
UPDATE m_document set storage_type_enum=1;
