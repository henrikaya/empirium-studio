#!/usr/bin/python
# -*- coding: utf8 -*-

import connection
import parsing
import database
import sys
import syslog

if __name__ == '__main__':

	syslog.openlog()

	if (len(sys.argv) < 4):
		syslog.syslog("Error : 3 args needed")
		sys.exit()

	identifiant = sys.argv[1]
	password = sys.argv[2]
	name = sys.argv[3]

	syslog.syslog("Update datas for %s (%s)" % (name, identifiant))
	
	cookies = connection.connect(identifiant, password)

	datas = parsing.getAllDatas(cookies, name)

	database.insertAllDatas(datas, name)

