#!/usr/bin/python
# -*- coding: utf8 -*-

import urllib, urllib2
import cookielib
from bs4 import BeautifulSoup
from lxml import etree

cookies = cookielib.LWPCookieJar() 
handlers = [
	urllib2.HTTPHandler(),
	urllib2.HTTPSHandler(),
	urllib2.HTTPCookieProcessor(cookies)
] 
opener = urllib2.build_opener(*handlers) 

def fetch(uri,param):
	req = urllib2.Request(uri,param)
	return opener.open(req)

#URL du formulaire
url = 'http://v2.empirium.net/sas.php3'

#Champ et valeur du formulaire
params = urllib.urlencode({'passemd5': 'f631fb3e62c97949860c7d5e164651a3', 'Resolution': '1366x768','Navigateur': 'Mozilla', 'joueur': '5221', 'passe': '-'})

#Envoi de la requete
req = fetch(url,params) 

opener2 = urllib2.build_opener() 
opener2.addheaders.append(('Cookie', "; ".join('%s=%s' % (cookie.name,cookie.value) for cookie in cookies))) 
f = opener2.open("http://v2.empirium.net/pan.php3") 
data = f.read() 
html = etree.HTML(data) 
result = etree.tostring(html, pretty_print=True, method="html") 
soup = BeautifulSoup(result)

# Recuperation des liens vers les radars de tous les vaisseaux
liste_liens_radars = [] 
for link in soup.findAll('a'):
	link_value = link.get('href')
	if link_value[1:15]=="/flotte/gauche":
		liste_liens_radars.append("http://v2.empirium.net" + link_value[1:]) 
print("||||||| Liens vers les radars") 
for v in liste_liens_radars:
	print(v) 

print("||||||| Vaisseaux et planetes du premier radar")
# Recuperation du premier radar
op3 = urllib2.build_opener() 
op3.addheaders.append(('Cookie', "; ".join('%s=%s' % (cookie.name,cookie.value) for cookie in cookies))) 
f3 = op3.open(liste_liens_radars[0]) 
d3 = f3.read() 
h3 = etree.HTML(d3) 
r3 = etree.tostring(h3, pretty_print=True, method="html")
s3 = BeautifulSoup(r3) 

for element in s3.findAll('div', attrs={"class":"carte_bulle"}):
	print("------")
	print(element)
	print("--Parsage--")
	print("Nom du vaisseau : %s" % element.find("h1").text)
	print("Type du vaisseau : %s" % element.find("img")['src'])
	print("Position : %s" % element.find("img").contents) #marche pas
	print("Propriétaire : %s" % element.find("a").contents)
