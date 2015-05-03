#!/usr/bin/python
# -*- coding: utf8 -*-

import connection
import parsing
import database
import sys

if __name__ == '__main__':

	if (len(sys.argv) < 4):
		print "Error : 3 args needed"
		sys.exit()

	identifiant = sys.argv[1]
	password = sys.argv[2]
	name = sys.argv[3]
	
	print "%s : Connection..." % sys.argv[0]
	cookies = connection.connect(identifiant, password)
	print "%s : Connection OK" % sys.argv[0]

	print "%s : Parsing..." % sys.argv[0]
	datas = parsing.getAllDatas(cookies, name)
	print "%s : Parsing OK" % sys.argv[0]

	print "%s : Insertion en base de %s éléments..." % (sys.argv[0], len(datas))
	database.insertAllDatas(datas, name)
	print "%s : Insertion en base de %s éléments OK" % (sys.argv[0], len(datas))

