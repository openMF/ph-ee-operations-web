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

INSERT INTO `m_permission`
(`grouping`,`code`,`entity_name`,`action_name`,`can_maker_checker`) VALUES
('special','ALL_FUNCTIONS',NULL,NULL,0),
('special','ALL_FUNCTIONS_READ',NULL,NULL,0),
('special', 'CHECKER_SUPER_USER', NULL, NULL, '0'),
('special','REPORTING_SUPER_USER',NULL,NULL,0);

INSERT INTO `m_role` (`id`, `name`, `description`)
VALUES
(1,'Super user','This role provides all application permissions.');

INSERT INTO m_role_permission(role_id, permission_id)
select 1, id
from m_permission
where code = 'ALL_FUNCTIONS';

INSERT INTO `m_appuser` (`id`, `office_id`, `username`, `firstname`, `lastname`, `password`, `email`, `firsttime_login_remaining`, `nonexpired`, `nonlocked`, `nonexpired_credentials`, `enabled`)
VALUES (1, 1, 'mifos', 'App', 'Administrator', '$2a$10$/rF0VNbTctI1034UwHPHr.XiQxBU3gCbKY/haNtWQTLpqfx8FH0gi', 'demomfi@mifos.org', '\0','','','','');

INSERT INTO `m_appuser_role` (`appuser_id`, `role_id`) VALUES (1,1);

update m_permission set can_maker_checker = false;