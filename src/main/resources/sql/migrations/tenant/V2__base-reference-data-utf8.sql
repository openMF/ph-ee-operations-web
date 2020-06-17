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

INSERT INTO `m_office` (`id`, `parent_id`, `hierarchy`, `external_id`, `name`, `opening_date`)
VALUES
(1,NULL,'.','1','Head Office','2009-01-01');

INSERT INTO `m_group_level` (`id`, `parent_id`, `super_parent`, `level_name`, `recursable`)
VALUES (1, NULL, 1, 'Center', 1);
INSERT INTO `m_group_level` (`id`, `parent_id`, `super_parent`, `level_name`, `recursable`)
VALUES (2, 1, 0, 'Group', 0);

-- create single code and code value for client identifiers
INSERT INTO `m_code`
(`code_name`, `is_system_defined`)
VALUES
('Customer Identifier',1),
('LoanCollateral',1),
('LoanPurpose',1),
('Gender',1),
('YesNo',1),
('GuarantorRelationship',1);

INSERT INTO `m_code_value`(`code_id`,`code_value`,`order_position`)
select mc.id, 'Passport', 1
from m_code mc
where mc.`code_name` = "Customer Identifier";

INSERT INTO `m_code_value`(`code_id`,`code_value`,`order_position`)
select mc.id, 'Id', 2
from m_code mc
where mc.`code_name` = "Customer Identifier";

INSERT INTO `m_code_value`(`code_id`,`code_value`,`order_position`)
select mc.id, 'Drivers License', 3
from m_code mc
where mc.`code_name` = "Customer Identifier";
