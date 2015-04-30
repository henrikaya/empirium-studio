#!/usr/bin/python
# -*- coding: utf8 -*-

import connexion
import parsing
import database

if __name__ == '__main__':

	cookies = connexion.connect('5221','f631fb3e62c97949860c7d5e164651a3')
	datas = parsing.getAllDatas(cookies, "Charles Le Chaleureux")

	print "Insertion de %s vaisseaux et planètes en base..." % len(datas)

	database.insertAllDatas(datas)

	print "Insertion OK"
