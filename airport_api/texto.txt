CREATE USER airport_user WITH PASSWORD 'admin123';
CREATE DATABASE airport_db OWNER airport_user;

\c airport_db

ALTER SCHEMA public OWNER TO airport_user;
GRANT ALL ON SCHEMA public TO airport_user;
GRANT CREATE ON SCHEMA public TO airport_user;

ALTER DEFAULT PRIVILEGES FOR USER airport_user IN SCHEMA public
GRANT ALL ON TABLES TO airport_user;

ALTER DEFAULT PRIVILEGES FOR USER airport_user IN SCHEMA public
GRANT ALL ON SEQUENCES TO airport_user;

ALTER DEFAULT PRIVILEGES FOR USER airport_user IN SCHEMA public
GRANT ALL ON FUNCTIONS TO airport_user;
