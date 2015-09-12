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

def updatePlayersAvatars():

    	client = MongoClient(config.get("MongoDB", "Host"), config.getint("MongoDB", "Port"))
	col = client['players']['players']

	#TODO: replace all system directives by python directives
	os.chdir("./static/images/players")
	for player in col.find():

		os.system("rm %s.*" % player["id"])
		ret = os.system("wget http://www.empirium.net/~ftp_avatar/v2_%s.jpg" % player["id"])
		os.system("mv v2_%s.jpg %s.jpg" % (player["id"], player["id"])) 
		if ret != 0:
			ret = os.system("wget http://www.empirium.net/~ftp_avatar/v2_%s.png" % player["id"])
			os.system("mv v2_%s.png %s.jpg" % (player["id"], player["id"])) 
			if ret != 0:
				ret = os.system("wget http://www.empirium.net/~ftp_avatar/v2_%s.gif" % player["id"])
				os.system("mv v2_%s.gif %s.jpg" % (player["id"], player["id"])) 

		# If downlad failed, add "unknown" image
		if ret != 0:
			os.system("cp unknown.jpg %s.jpg" % player["id"])

	os.chdir("../../..")

	return

def writeJSplayersList(playersList):

    os.chdir("./static/")

    if os.path.isfile("playersList.js"):
        os.remove("playersList.js")

    f = open("playersList.js", "w")
    f.write("$(function () {\n\n")
    f.write("playersList = [\n")

    for i in range(len(playersList) - 1):

        #TODO: manage this very specific case by another way
        if playersList[i]['name'] == "Charles Le Chaleureu":
            playersList[i]['name'] = "Charles Le Chaleureux"

        f.write("\"%s\",\n" % playersList[i]['name'])

    f.write("\"%s\"\n" % playersList[-1]['name'])
    f.write("]\n")
    f.write("});\n")
    f.close()
    os.chdir("..")

    syslog.syslog("JS players list updated")

    return

def updatePlayersList():

	playersList = tools.parsing.getPlayersList()

    	client = MongoClient(config.get("MongoDB", "Host"), config.getint("MongoDB", "Port"))
	col = client['players']['players']

	oldPlayersListId = []
	newPlayersListId = []
	for player in col.find():
		oldPlayersListId.append(player['id'])

	for player in playersList:

		newPlayersListId.append(player['id'])

		if not player['id'] in oldPlayersListId:

			player['allies'] = []
			player['last_connection'] = ""
			player['last_update'] = -1
			player['password'] = ""

			if len(player['name']) >= 20:
				syslog.syslog("Warning : player %s - %s has a name with more than 20 characters. His name could be truncated, please check it." % (player['id'], player['name']))

			try:
				col.insert(player)
				syslog.syslog("Insert player %s - %s" % (player['id'], player['name']))
			except Exception, e:
				syslog.syslog("Exception occured during players list updating (adding player %s - %s) : %s" % (player['id'], player['name'], e))


	for player in oldPlayersListId:

		if not player in newPlayersListId:
			try:
				col.remove({'id':player})
				syslog.syslog("Delete player %s" % player)
			except Exception, e:
				syslog.syslog("Exception occured during players list updating (deleting player %s) : %s" % (player, e))

        writeJSplayersList(playersList)

	return

def process():

	db_host = config.get("MongoDB", "Host")
	db_port = config.getint("MongoDB", "Port")
    	client = MongoClient(db_host, db_port)
	col = client.players.players

	while True:

		nb = tools.parsing.getCycleNumber()
		players = col.find({'last_update':{'$lte':nb-1}})

		for j in players:
			tools.updateDatas.update(j['id'], j['password'], j['name'], 1, db_host, db_port)

		cycle_processing = False
		while nb == -1:

			cycle_processing = True
			time.sleep(60)
			nb = tools.parsing.getCycleNumber()

		if cycle_processing:
			updatePlayersList()
			updatePlayersAvatars()

		#TODO: Sleep durations to store in conf
		if not cycle_processing:
			time.sleep(60*30)


if __name__ == '__main__':

    syslog.openlog()
    syslog.syslog("Worker starts !")

    config = ConfigParser.ConfigParser()
    config.read("webserver.conf")

    process()

