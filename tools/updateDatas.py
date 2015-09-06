#!/usr/bin/python
# -*- coding: utf8 -*-

import connection
import parsing
import database
import sys
import syslog
import ConfigParser

def update(identifiant, password, name, id_request, db_host, db_port):

	syslog.openlog()

	cycle = parsing.getCycleNumber()

	syslog.syslog("Update datas for %s (%s)" % (name, identifiant))
	
	cookies = connection.connect(identifiant, password)
	connection.loadGalaxy(cookies, "Aon")
	datas = parsing.getAllDatas(cookies, name, id_request, db_host, db_port)
	database.insertAllDatas(datas, name, cycle, id_request, db_host, db_port)
	database.updateCycleNumber(name, cycle, db_host, db_port)


if __name__ == '__main__':

	if (len(sys.argv) < 5):
		syslog.syslog("Error : 4 args needed")
		sys.exit()

	identifiant = sys.argv[1]
	password = sys.argv[2]
	name = sys.argv[3]
	id_request = sys.argv[4]

    	config = ConfigParser.ConfigParser()
    	config.read("webserver.conf")
    	db_host = config.get("MongoDB", "Host")
	db_port = config.getint("MongoDB", "Port")

	update(identifiant, password, name, id_request, db_host, db_port)
