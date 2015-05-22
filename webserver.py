#!/usr/bin/python
# -*- coding:utf-8 -*-

from flask import Flask, request, escape, session, render_template, Response
import jinja2
from pymongo import MongoClient
import urllib, urllib2
import cookielib
import tools.connection
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

app = Flask(__name__)
app.secret_key = 'ts\x8a\x120\x06\x1d\xb6\xb5\xefMS\x17\xfe|~\xa5\xed}\xb9\x8f\x8d\xcbS'

@app.route('/connection/', methods=['POST'], strict_slashes=False)
def user_connect():

	name = request.form['name']
	password = request.form['pass']
	
	client = MongoClient()
	col = client.joueurs.joueurs
	joueur = col.find_one({'name':name})

	if (joueur == None):
		syslog.syslog("Someone tried to connect as %s, but this name is unknown" % name)
		return "player unknown"

	if (joueur.has_key("id")):
		identifiant = joueur['id']
	else:
		syslog.syslog("Someone tried to connect as %s - this name is known but there is no id associated" % name)
		return "player known but id unknown"

	if (tools.connection.isPasswordCorrect(identifiant, password)):
		session['id'] = identifiant

		# TODO: si mdp different, lancer une mise a jour des donnees empi avec ce nouveau mdp
		if (joueur['password'] != password):
			syslog.syslog("Update password of player %s" % identifiant)
			os.system("/home/pi/Documents/python/empi/repo/empirium_studio/tools/updateDatas.py %s %s %s &" % (identifiant, password, name))

		col.update({"id":identifiant},{"$set":{"password":password}})
		col.update({"id":identifiant},{"$set":{"last_connection":time.asctime()}})
		syslog.syslog("%s (%s) connected" % (name, identifiant))
		return "success"
	else:
		syslog.syslog("%s (%s) tried to connect - wrong password or cycle processing" % (name, identifiant))
		session.pop('id', None)
		return "wrong password"

	syslog.syslog("Internal error during connection of %s" % name)
	return "Erreur interne du serveur. Contactez un administrateur (LG)."

@app.route('/getplayers', methods=['GET', 'POST'], strict_slashes=False)
def getplayers():

	client = MongoClient('localhost', 27017)
	db = client['joueurs']
	col = db['joueurs']
	ret = "<?xml version='1.0' encoding='UTF-8' ?><options>"

	if (request.form.has_key('pattern')):
		pattern = '^' + urllib2.unquote(request.form['pattern'])
		myrequest = {'name':{'$regex':pattern}}
		values = col.find(myrequest).sort([("name",1)]).limit(10)
	else:
		values = col.find().sort([("name",1)]).limit(10);

	for value in values:
		if (value.has_key("name")):
			ret += "<option>"
			ret += str(value['name'])
			ret += "</option>"
	
	ret += "</options>"

	syslog.syslog("Someone gets players XML")

	return Response(ret, mimetype='text/xml');

@app.route('/get/<num_tour>', methods=['GET'], strict_slashes=False)
def get(num_tour):

	if 'id' in session:

		client = MongoClient('localhost', 27017)
		db = client['test']
		col = db["tour_%s" % num_tour]
		
		data = []

		for value in col.find():
			elmt = json.dumps(value, sort_keys=True, indent=4, default=json_util.default)
			data.append(str(elmt))

		ret = "[" + ",".join(data) + "]"

		syslog.syslog("%s gets map for cycle %s" % (session['id'], num_tour))

		return ret

	syslog.syslog("Someone tried to get map for cycle %s without to be connected" % num_tour)
	return "Vous n'êtes pas identifié."

@app.route('/', methods=['GET'], strict_slashes=False)
def index():
    syslog.syslog("Someone gets index.html")
    return render_template('index.html')

if __name__ == '__main__':

    syslog.openlog()
    syslog.syslog("Web-server starts !")

    config = ConfigParser.ConfigParser()
    config.read("webserver.conf")

    app.run(debug=True, host="0.0.0.0", port=config.getint("Server","Port"))

