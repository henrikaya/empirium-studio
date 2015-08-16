#!/usr/bin/python
# -*- coding: utf8 -*-

import connection
import parsing
import database
import sys
import syslog
import ConfigParser

def update(identifiant, password, name, db_host, db_port):

	syslog.openlog()

	cycle = parsing.getCycleNumber()

	syslog.syslog("Update datas for %s (%s)" % (name, identifiant))
	
	cookies = connection.connect(identifiant, password)
	connection.loadGalaxy(cookies, "Aon")
	datas = parsing.getAllDatas(cookies, name)
	database.insertAllDatas(datas, name, cycle, db_host, db_port)
	database.updateCycleNumber(name, cycle, db_host, db_port)


if __name__ == '__main__':

	if (len(sys.argv) < 4):
		syslog.syslog("Error : 3 args needed")
		sys.exit()

	identifiant = sys.argv[1]
	password = sys.argv[2]
	name = sys.argv[3]

    	config = ConfigParser.ConfigParser()
    	config.read("webserver.conf")
    	db_host = config.get("MongoDB", "Host")
	db_port = config.getint("MongoDB", "Port")

	update(identifiant, password, name, db_host, db_port)
