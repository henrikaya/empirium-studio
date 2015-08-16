#!/usr/bin/python
# -*- coding: utf8 -*-

import urllib, urllib2
import cookielib
from bs4 import BeautifulSoup
from lxml import etree

def connect(id,password):
	cookies = cookielib.LWPCookieJar() 
	handlers = [
		urllib2.HTTPHandler(),
		urllib2.HTTPSHandler(),
		urllib2.HTTPCookieProcessor(cookies)
	] 
	opener = urllib2.build_opener(*handlers) 

	#URL du formulaire
	url = 'http://v2.empirium.net/sas.php3'
	
	#Champ et valeur du formulaire
	params = urllib.urlencode({'passemd5': password, 'Resolution': '1366x768','Navigateur': 'Mozilla', 'joueur': id, 'passe': '-'})
	
	#Envoi de la requete
	req = urllib2.Request(url,params)
	opener.open(req)

	return cookies

def isPasswordCorrect(identifiant, password):

	cookies = connect(identifiant, password)
	opener = urllib2.build_opener()
	opener.addheaders.append(('Cookie', "; ".join('%s=%s' % (cookie.name,cookie.value) for cookie in cookies)))
	f = opener.open("http://v2.empirium.net/pan.php3")
	data = f.read()
	erreur = data.count("http://v2.empirium.net/index.php?r=ident&err=sess")
	erreur += data.count("Traitement en cours")

	if (erreur == 0):
		return True
	else:
		return False

def loadGalaxy(cookies, name):

	url = ""
	if name == "Aon":
		url = "http://v2.empirium.net/console.php?ChargerGalaxie=3"
	elif name == "Academia":
		url = "http://v2.empirium.net/console.php?ChargerGalaxie=4"
	else:
		return

	opener = urllib2.build_opener() 
	opener.addheaders.append(('Cookie', "; ".join('%s=%s' % (cookie.name,cookie.value) for cookie in cookies))) 
	f = opener.open(url) 

	return

