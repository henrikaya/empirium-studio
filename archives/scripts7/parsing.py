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
		type_complet = element.find("h1").text
		if type_complet[0] != '\n':
			type = type_complet[0]
		else:
			type = type_complet[1]

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
			el.append(element.find("img")['src'][2:])
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
			el.append(element.find("h1").find("img")['src'][2:])
			el.append(coord.split("/")[0])
			el.append(coord.split("/")[1])
			el.append(owner)
			out.append(el)
		else:
			indexCoord = type_complet.find("en ") + 3
			coord = type_complet[indexCoord:].strip(" ")
			coordX = coord.split("/")[0]
			coordY = coord.split("/")[1]
			for group in element.findAll("div", attrs={"class":"sousgroupe"}):
				for elmt in str(group).split("<br/><br/>"):
					el = []
					elmt = elmt.replace("\n", " ")
					if elmt[1]=='d':
						elmt = elmt[24:]
					if elmt[2]!='/':
						if len(elmt) < 20:
							continue
						if elmt[19] == 'v':
							elmt = elmt[1:]
						if elmt[18] == 'v':
							index1 = elmt.find(">")
							index2 = index1 + elmt[index1:].find(" - ")
							id = elmt[index1+1:index2]
							index3 = index2 + elmt[index2:].find(" de <")
							nom = elmt[index2+3:index3]
							index4 = elmt.find("/")
							index5 = index4 + elmt[index4:].find("\"")
							type = elmt[index4:index5]
							index6 = elmt.find("\"gauche\">") + 9
							index7 = index6 + elmt[index6:].find("</a>")
							owner = elmt[index6:index7]
							el.append("Vaisseau")
							el.append(id)
							el.append(nom)
							el.append(type)
							el.append(coordX)
							el.append(coordY)
							el.append(owner)
							out.append(el)
						elif elmt[19] == 'p':
							index1 = elmt.find(">")
							index2 = index1 + elmt[index1:].find(" ")
							id =  elmt[index1+4:index2]
							index3 = index2 + elmt[index2:].find("<")
							nom = elmt[index2+3:index3]
							index4 = elmt.find("/")
							index5 = index4 + elmt[index4:].find("\"")
							type = elmt[index4:index5]
							index6 = index3 + elmt[index3:].find("> de ") + 5
							index7 = index6 + elmt[index6:].find("<")
							owner = elmt[index6:index7]
							el.append("Planete")
							el.append(id)
							el.append(nom)
							el.append(type)
							el.append(coordX)
							el.append(coordY)
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

	#for i in range(1):
	for i in range(len(links)):
		datas.extend(getDatas(cookies, links[i],playerName))
		print "{0:.0f}% radars processed...".format(float(i+1)/len(links) * 100)
	
	return datas
