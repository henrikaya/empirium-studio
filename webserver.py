#!/usr/bin/python
# -*- coding:utf-8 -*-

from flask import Flask, request, escape, session, render_template, Response
import jinja2
from pymongo import MongoClient
import urllib, urllib2
import cookielib
import tools.connection
import tools.parsing
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

@app.route('/disconnection/', methods=['GET'], strict_slashes=False)
def user_disconnect():

	if 'id' in session:

		syslog.syslog("Player %s disconnected" % session['id'])
		session.pop('id')

		return "disconnection ok"

	return "player not connected"


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

	session['id'] = identifiant
	session['name'] = name

	if (tools.connection.isPasswordCorrect(identifiant, password)):
		session['id'] = identifiant
		session['name'] = name

		if (joueur['password'] != password or joueur['last_update'] != tools.parsing.getCycleNumber()):
			syslog.syslog("Update password of player %s" % identifiant)
			os.system("%s %s %s \"%s\" &" % (config.get("Tools", "Update"), identifiant, password, name))

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

@app.route('/getcyclenumber', methods=['GET'], strict_slashes=False)
def getcyclenumber():

	syslog.syslog("Someone gets cycle number")

	data = {}
	data['num'] = tools.parsing.getCycleNumber()
	
	return Response(json.dumps(data, default=json_util.default), mimetype='application/json')

@app.route('/get/<num_tour>', methods=['GET'], strict_slashes=False)
def get(num_tour):

	if 'id' in session:

		client = MongoClient('localhost', 27017)
		db = client['test']
		col = db["tour_%s" % num_tour]

		data = []

		col_players = client['joueurs']['joueurs']
		joueur = col_players.find_one({'name':session['name']})
		allies = joueur['allies']

		allies.append(session["name"])

		for value in col.find({"from":{"$in":allies}}):
			elmt = json.dumps(value, sort_keys=True, indent=4, default=json_util.default)
			data.append(str(elmt))

		interest = col.find_one({"from":{"$in":allies},"owner":session["name"], "model":"Commodore"})

		if interest == None:
			interest = col.find_one({"from":{"$in":allies},"owner":session["name"]})

		if interest == None:
			interest = col.find_one({"from":{"$in":allies}})

		if interest != None:
			x = int(interest['x'])
			y = int(interest['y'])
		else:
			x = 285
			y = 154
		ret = '{ "interest" : { "x":%s, "y":%s },' % (x,y)
		ret += '"datas" : [' + ','.join(data) + ']'
		ret += '}'
		syslog.syslog("%s gets map for cycle %s" % (session['id'], num_tour))

		return ret

	syslog.syslog("Someone tried to get map for cycle %s without to be connected" % num_tour)
	return "Vous n'êtes pas identifié."

@app.route('/request/friendship/<req>', methods=['GET'], strict_slashes=False)
def request_friendship(req):

	f_request = json.loads(req)

	if 'id' in session:

		if not f_request.has_key('to'):
			return "invalid request", 300

		if session['name'] == f_request['to']:
			return "you cannot be allie to yourself", 200

		client = MongoClient('localhost', 27017)
		col = client['requests']['friendship']
		col_players = client['joueurs']['joueurs']

		post = {}
		post['from_id'] = session['id']
		post['from_name'] = session['name']
		post['to_name'] = f_request['to']

		i_post = {}
		i_post['from_name'] = f_request['to']
		i_post['to_name'] = session['name']

		# if inverted request already in database
		if (col.find_one(i_post) != None):		
			col.remove(i_post)
			local_allies = col_players.find({"name":session['name']})[0]['allies']
			remote_allies = col_players.find({"name":f_request['to']})[0]['allies']

			if not f_request['to'] in local_allies:
				local_allies.append(f_request['to'])
				remote_allies.append(session['name'])
				col_players.update({"name":session['name']},{"$set":{"allies":local_allies}})
				col_players.update({"name":f_request['to']},{"$set":{"allies":remote_allies}})
			return "now allies", 200
		else:

			# if no allies yet
			if f_request['to'] in  col_players.find({"name":session['name']})[0]['allies']:
				return "already allies", 200

			remote_allies = col_players.find({"name":f_request['to']})[0]['allies']

			# if no request yet
			if (col.find_one(post) != None):
				return "allies request already exists", 200
			else:
				# if player from "to" attributes exists
				if col_players.find_one({"name":f_request['to']}) != None:
					col.insert(post)
					syslog.syslog("%s (%s) sends a friendship request to %s" % (session['name'], session['id'], "a"))
					return "allies request sent", 200
				else:
					return "player does not exist", 200

		return "", 200

	syslog.syslog("Someone tried to send a friendship request to %s" % "a")
	return "Vous n'êtes pas identifié", 300

@app.route('/', methods=['GET'], strict_slashes=False)
def index():
    syslog.syslog("Someone gets index.html")
    return render_template('index.html')

if __name__ == '__main__':

    syslog.openlog()
    syslog.syslog("Web-server starts !")

    config = ConfigParser.ConfigParser()
    config.read("webserver.conf")

    app.run(debug=False, host="0.0.0.0", port=config.getint("Server","Port"), threaded=True)

