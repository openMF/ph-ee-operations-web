DELETE FROM `errorcode` WHERE `RECOVERABLE`=false;

DELETE FROM `errorcode` WHERE `ERROR_MESSAGE`='DS timeout.'
