#!/usr/bin/python
# -*- coding: utf8 -*-

import urllib, urllib2
import cookielib

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
