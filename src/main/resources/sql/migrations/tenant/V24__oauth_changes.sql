CREATE TABLE `oauth_client_details` (
  `client_id` varchar(128) NOT NULL,
  `resource_ids` varchar(256) DEFAULT NULL,
  `client_secret` varchar(256) DEFAULT NULL,
  `scope` varchar(256) DEFAULT NULL,
  `authorized_grant_types` varchar(256) DEFAULT NULL,
  `web_server_redirect_uri` varchar(256) DEFAULT NULL,
  `authorities` varchar(256) DEFAULT NULL,
  `access_token_validity` int(11) DEFAULT NULL,
  `refresh_token_validity` int(11) DEFAULT NULL,
  `additional_information` varchar(4096) DEFAULT NULL,
  `autoapprove` BIT(1) NULL DEFAULT NULL,
  PRIMARY KEY (`client_id`)
)
COLLATE='utf8_general_ci'
ENGINE=InnoDB
AUTO_INCREMENT=1;

INSERT INTO `oauth_client_details` (`client_id`, `resource_ids`, `scope`, `authorized_grant_types`, `access_token_validity`, `refresh_token_validity`)
VALUES ('client', '${identityProviderResourceId},${tenantDatabase}', 'identity', 'password,refresh_token', ${userAccessTokenValidity}, ${userRefreshTokenValidity});