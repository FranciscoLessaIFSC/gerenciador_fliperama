CREATE TABLE compra (
  idcompra INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  jogador_idjogador INTEGER UNSIGNED NOT NULL,
  quantidade INTEGER UNSIGNED NULL,
  valor INTEGER UNSIGNED NULL,
  metodo VARCHAR(50)) NULL,
  PRIMARY KEY(idcompra),
  INDEX compra_FKIndex1(jogador_idjogador)
);

CREATE TABLE compra_has_promocao (
  compra_idcompra INTEGER UNSIGNED NOT NULL,
  promocao_idpromocao INTEGER UNSIGNED NOT NULL,
  PRIMARY KEY(compra_idcompra, promocao_idpromocao),
  INDEX compra_has_promocao_FKIndex1(compra_idcompra),
  INDEX compra_has_promocao_FKIndex2(promocao_idpromocao)
);

CREATE TABLE funcionario (
  idfuncionario INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(50) NULL,
  dados INTEGER UNSIGNED NULL,
  horastrabalhadas INTEGER UNSIGNED NULL,
  faltas INTEGER UNSIGNED NULL,
  entradainicio DATE NULL,
  entradafim DATE NULL,
  PRIMARY KEY(idfuncionario)
);

CREATE TABLE jogador (
  idjogador INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(20) NULL,
  cartao INTEGER UNSIGNED NULL,
  saldo INTEGER UNSIGNED NULL,
  pontuacao INTEGER UNSIGNED NULL,
  datanascimento DATE NULL,
  PRIMARY KEY(idjogador)
);

CREATE TABLE jogo (
  idjogo INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(50) NULL,
  fichas INTEGER UNSIGNED NULL,
  datainicio DATE NULL,
  datafim DATE NULL,
  pontuacao INTEGER UNSIGNED NULL
);

CREATE TABLE jogo_has_machine (
  machine_idmachine INTEGER UNSIGNED NOT NULL,
  PRIMARY KEY(machine_idmachine),
  INDEX jogo_has_machine_FKIndex2(machine_idmachine)
);

CREATE TABLE machine (
  idmachine INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  nome VARCHAR(50) NULL,
  ligada INTEGER UNSIGNED NULL,
  PRIMARY KEY(idmachine)
);

CREATE TABLE partida (
  idpartida INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  duracao TIME NULL,
  PRIMARY KEY(idpartida)
);

CREATE TABLE partida_has_jogador (
  partida_idpartida INTEGER UNSIGNED NOT NULL,
  jogador_idjogador INTEGER UNSIGNED NOT NULL,
  PRIMARY KEY(partida_idpartida, jogador_idjogador),
  INDEX partida_has_jogador_FKIndex1(partida_idpartida),
  INDEX partida_has_jogador_FKIndex2(jogador_idjogador)
);

CREATE TABLE partida_has_jogo (
  partida_idpartida INTEGER UNSIGNED NOT NULL,
  PRIMARY KEY(partida_idpartida),
  INDEX partida_has_jogo_FKIndex1(partida_idpartida)
);

CREATE TABLE promocao (
  idpromocao INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  datainicio DATE NULL,
  datafim DATE NULL,
  desconto FLOAT NULL,
  PRIMARY KEY(idpromocao)
);

CREATE TABLE usuario (
  idusuario INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
  login VARCHAR(20) NULL,
  senha VARCHAR(50) NULL,
  admin BOOL NULL,
  PRIMARY KEY(idusuario)
);
