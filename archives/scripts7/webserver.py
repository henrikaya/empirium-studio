#!/usr/bin/python
# -*- coding:utf-8 -*-

from flask import Flask, request, escape, session, render_template, Response
from pymongo import MongoClient
import urllib, urllib2
import cookielib
import connexion
import time
import os

import sys
reload(sys)
sys.setdefaultencoding('utf-8')

app = Flask(__name__)
app.secret_key = 'ts\x8a\x120\x06\x1d\xb6\xb5\xefMS\x17\xfe|~\xa5\xed}\xb9\x8f\x8d\xcbS'

@app.route('/connexion/', methods=['POST'], strict_slashes=False)
def user_connect():

	name = request.form['name']
	password = request.form['pass']
	
	client = MongoClient()
	col = client.joueurs.joueurs
	joueur = col.find_one({'name':name})

	if (joueur == None):
		return "Joueur inconnu"

	if (joueur.has_key("id")):
		identifiant = joueur['id']
	else:
		return "Joueur connu mais ID inconnu"

	if (connexion.isPasswordCorrect(identifiant, password)):
		session['id'] = identifiant

		# TODO: si mdp different, lancer une mise a jour des donnees empi avec ce nouveau mdp
		if (joueur['password'] != password):
			os.system("/home/pi/Documents/python/empi/scripts5/updateDatas.py %s %s %s &" % (identifiant, password, name))

		col.update({"id":identifiant},{"$set":{"password":password}})
		col.update({"id":identifiant},{"$set":{"last_connexion":time.asctime()}})
		return "Identification réussie"
	else:
		session.pop('id', None)
		return "Identification échouée"
	
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

	return Response(ret, mimetype='text/xml');

@app.route('/get/<num_tour>', methods=['GET'], strict_slashes=False)
def get(num_tour):

	if 'id' in session:

		client = MongoClient('localhost', 27017)
		db = client['test']
		col = db["tour_%s" % num_tour]
		ret = ""

		for value in col.find():
			ret += str(value)

		return ret

	return "Vous n'êtes pas identifié."

@app.route('/', methods=['GET'], strict_slashes=False)
def index():
    return render_template('index.html')

if __name__ == '__main__':

    app.run(debug=True, host="0.0.0.0", port=50000)
