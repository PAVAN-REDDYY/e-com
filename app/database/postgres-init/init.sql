-- Runs once, on first initialisation of the Postgres data volume.
-- Database-per-service: each microservice owns an isolated database so there is
-- no shared schema. (In production each service often gets its own DB instance;
-- one instance with two databases keeps local dev light while preserving the
-- "no shared tables" boundary.)
CREATE DATABASE catalog;
CREATE DATABASE orders;
