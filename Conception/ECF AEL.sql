--USE master;
--GO

--DROP DATABASE ECF_AEL_CDA;
--GO

CREATE DATABASE ECF_AEL_CDA;
GO

USE ECF_AEL_CDA;
GO

CREATE TABLE Role (
	IdRole INT PRIMARY KEY NOT NULL IDENTITY(1,1),
	NomRole varchar(50) NOT NULL);
GO

CREATE TABLE Users (
	IdUser INT PRIMARY KEY NOT NULL IDENTITY(1,1),
	NomUser varchar(50) NOT NULL,
	PrenomUser varchar(50) NOT NULL,
	Login varchar(50) NOT NULL,
	MotDePasse varchar(255) NOT NULL,
	IdRole INT NOT NULL,
	FOREIGN KEY (IdRole) REFERENCES Role(IdRole));
GO

CREATE TABLE Calendrier (
	DateHeure datetime PRIMARY KEY NOT NULL);
GO

CREATE TABLE Eleve (
	IdEleve INT PRIMARY KEY NOT NULL IDENTITY(1,1),
	NomEleve varchar(50) NOT NULL,
	PrenomEleve varchar(50) NOT NULL,
	Code bit NOT NULL,
	Conduite bit NOT NULL,
	DateNaissance date NOT NULL,
	DateInscription date NOT NULL);
GO

CREATE TABLE Moniteur (
	IdMoniteur INT PRIMARY KEY NOT NULL IDENTITY(1,1),
	NomMoniteur varchar(50) NOT NULL,
	PrenomMoniteur varchar(50) NOT NULL,
	DateNaissance date NOT NULL,
	DateEmbauche date NOT NULL,
	Activite bit NOT NULL DEFAULT 1);
GO

CREATE TABLE Modele (
	ModeleVehicule varchar(50) PRIMARY KEY NOT NULL,
	Marque varchar(50) NOT NULL,
	Annee nchar(4) NOT NULL,
	DateAchat date NOT NULL);
GO

CREATE TABLE Vehicule (
	NoImmat varchar(9) PRIMARY KEY NOT NULL,
	ModeleVehicule varchar(50) NOT NULL,
	Etat bit NOT NULL DEFAULT 1,
	FOREIGN KEY (ModeleVehicule) REFERENCES Modele(ModeleVehicule));
GO

CREATE TABLE Lecon (
	ModeleLecon varchar(50) NOT NULL,
	DateHLecon datetime NOT NULL,
	EleveId INT NOT NULL,
	MoniteurId INT NOT NULL,
	Duree int NOT NULL,
	PRIMARY KEY (ModeleLecon, DateHLecon, EleveId, MoniteurId),
	FOREIGN KEY (ModeleLecon) REFERENCES Modele(ModeleVehicule),
	FOREIGN KEY (DateHLecon) REFERENCES Calendrier(DateHeure),
	FOREIGN KEY (EleveId) REFERENCES Eleve(IdEleve),
	FOREIGN KEY (MoniteurId) REFERENCES Moniteur(IdMoniteur));