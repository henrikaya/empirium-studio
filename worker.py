#!/usr/bin/python
# -*- coding:utf-8 -*-

from pymongo import MongoClient
import tools.connection
import tools.parsing
import tools.updateDatas
import time
import os
from bson import BSON
from bson import json_util
import json
import syslog
import sys
import ConfigParser

reload(sys)
sys.setdefaultencoding('utf-8')

def process():

	client = MongoClient()
	col = client.joueurs.joueurs

	while True:

		nb = tools.parsing.getCycleNumber()
		joueurs = col.find({'last_update':{'$lte':nb-1}})

		for j in joueurs:
			print 'Update : %s' % j['name']
			tools.updateDatas.update(j['id'], j['password'], j['name'])
			
		cycle_processing = False
		while nb == -1:

			cycle_processing = True
			time.sleep(60)
			nb = tools.parsing.getCycleNumber()

		# Sleep durations to store in conf
		if not cycle_processing:
			time.sleep(60*30)


if __name__ == '__main__':

    syslog.openlog()
    syslog.syslog("Worker starts !")

    config = ConfigParser.ConfigParser()
    config.read("webserver.conf")

    process()

