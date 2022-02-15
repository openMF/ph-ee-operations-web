INSERT INTO `m_permission` (`grouping`, `code`, `entity_name`, `action_name`, `can_maker_checker`)
VALUES ('operations', 'REFUND', 'TRANSFER', 'ACTIVATE', '0');

INSERT INTO m_role_permission(role_id, permission_id)
select 1, id
from m_permission
where code = 'REFUND';