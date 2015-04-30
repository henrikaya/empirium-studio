#!/usr/bin/python
# -*- coding: utf8 -*-

import urllib, urllib2
import cookielib
from bs4 import BeautifulSoup
from lxml import etree

def getShipLinks(cookies):
	
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
	
	return liste_liens_radars 

def getDatas(cookies, link, playerName):
	# Recuperation du radar
	op3 = urllib2.build_opener() 
	op3.addheaders.append(('Cookie', "; ".join('%s=%s' % (cookie.name,cookie.value) for cookie in cookies))) 
	f3 = op3.open(link) 
	d3 = f3.read() 
	h3 = etree.HTML(d3) 
	r3 = etree.tostring(h3, pretty_print=True, method="html")
	s3 = BeautifulSoup(r3)

	out = []

	# Pour chaque element visible sur le radar	
	for element in s3.findAll('div', attrs={"class":"carte_bulle"}):
		el = []
		# Recuperation du type de l'element (Fregate, Navette,
		# Planete, Groupe, ...)
		type = element.find("h1").text
		if type[0] != '\n':
			type = type[0]
		else:
			type = type[1]

		# TODO: il faudra gérer le cas des Leviathan		
		if (type == 'N' or type == 'F' or type == 'C'):
			IdName = str(element.find("h1")).strip("<h1>").strip("</h1").strip("Navette ").strip("Frégate ").strip("Croiseur").strip("Commodore").strip("\n").split("<br/>")
			indexCoordStart = str(element).find("<img")
			indexCoordStart += str(element)[indexCoordStart:].find(">") + 1
			indexCoordEnd = indexCoordStart + str(element)[indexCoordStart:].find("<br/>") - 10
			coord = str(element)[indexCoordStart:indexCoordEnd].strip(" ").split("/")
 			el.append("Vaisseau")
			el.append(IdName[0])
			el.append(IdName[1])
			el.append(element.find("img")['src'])
			el.append(coord[0].strip(" "))
			el.append(coord[1].strip(" "))
			el.append(element.find("a").contents[0].encode("utf8"))
			out.append(el)
		elif type == 'P':
			index = str(element.find("h1")).find("Planète")
			idName = str(element.find("h1"))[index:].strip("Planète ").strip("</h1>").strip("\n").split("<br/>")
			owner = element.find("a").contents[0].encode('utf8')
			if (owner == "Gérer"):
				owner = playerName
			indexCoordStart = str(element).find("</h1>") + 5
			indexCoordEnd = indexCoordStart + str(element)[indexCoordStart:].find("<br/>") - 10
			coord = str(element)[indexCoordStart:indexCoordEnd] 

			el.append("Planete")			
			el.append(idName[0])
			el.append(idName[1])
			el.append(element.find("h1").find("img")['src'])
			el.append(coord.split("/")[0])
			el.append(coord.split("/")[1])
			el.append(owner)
			out.append(el)
	return out

def printPlanet(planet):

	print("Identifiant : %s" % planet[1])
	print("Nom : %s" % planet[2])
	print("Type : %s" % planet[3])	
	print("X : %s" % planet[4])
	print("Y : %s" % planet[5])
	print("Propriétaire : %s" % planet[6])

	return

def printShip(ship):
	
	print("Identifiant : %s" % ship[1])
	print("Nom : %s" % ship[2])
	print("Type : %s" % ship[3])
	print("X : %s" % ship[4])
	print("Y : %s" % ship[5])
	print("Propriétaire : %s" % ship[6])

	return

def printData(data):

	print("Nature : %s" % data[0])

	if data[0] == "Vaisseau":
		printShip(data)
	elif data[0] == "Planete":
		printPlanet(data)

	return

def getAllDatas(cookies, playerName):
	
	links = getShipLinks(cookies)
	
	datas = []

	for i in range(1):
	#for i in range(len(links)):
		datas.extend(getDatas(cookies, links[i],playerName))
		print "{0:.0f}% radars processed...".format(float(i+1)/len(links) * 100)
	
	return datas
