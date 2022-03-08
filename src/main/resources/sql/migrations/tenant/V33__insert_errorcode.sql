INSERT INTO `errorcode` (`TRANSACTION_TYPE`, `ERROR_MESSAGE`, `ERROR_CODE`, `RECOVERABLE`)
VALUES (
           'COLLECTION-MPESA',
           'The transaction is being processed',
           '500.001.1001',
           true
       );

INSERT INTO `errorcode` (`TRANSACTION_TYPE`, `ERROR_MESSAGE`, `ERROR_CODE`, `RECOVERABLE`)
VALUES (
           'COLLECTION-MPESA',
           'DS timeout.',
           '1037',
           true
       );

INSERT INTO `errorcode` (`TRANSACTION_TYPE`, `ERROR_MESSAGE`, `ERROR_CODE`, `RECOVERABLE`)
VALUES (
           'COLLECTION-MPESA',
           'Request cancelled by user',
           '1031',
           false
       );

INSERT INTO `errorcode` (`TRANSACTION_TYPE`, `ERROR_MESSAGE`, `ERROR_CODE`, `RECOVERABLE`)
VALUES (
           'COLLECTION-MPESA',
           'Request cancelled by user',
           '1032',
           false
       );
