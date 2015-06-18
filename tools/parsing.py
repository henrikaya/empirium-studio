#!/usr/bin/python
# -*- coding: utf8 -*-

import urllib, urllib2
import cookielib
from bs4 import BeautifulSoup
from lxml import etree
import syslog

def getCycleNumber():

	opener = urllib2.build_opener()
	f = opener.open("http://v2.empirium.net")
	html = etree.HTML(f.read())
	result = etree.tostring(html, pretty_print=True, method="html")

	coord = result.find("[ Tour n") + 14;

	return result[coord:coord+3]

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

def getPlanetLinks(cookies):
	
	opener2 = urllib2.build_opener() 
	opener2.addheaders.append(('Cookie', "; ".join('%s=%s' % (cookie.name,cookie.value) for cookie in cookies))) 
	f = opener2.open("http://v2.empirium.net/pan.php3?th=pl") 
	data = f.read() 
	html = etree.HTML(data) 
	result = etree.tostring(html, pretty_print=True, method="html") 
	soup = BeautifulSoup(result)

	# Recuperation des liens vers les radars de tous les vaisseaux
	liste_liens_radars = [] 
	for link in soup.findAll('a'):
		link_value = link.get('href')
		if link_value[1:16]=="/planete/gauche" and link_value.count("Impots") == 0:
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
		# Navette, Fregate and Croiseur processing
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
		# Vortex processing
		elif type == 'V':
			indexID = str(element).find("Vortex ") + 7
			indexIDend = indexID + str(element)[indexID:].find("<")
			ident = str(element)[indexID:indexIDend]

			indexDest = str(element).find("Vers ") + 5
			indexDestend = indexDest + str(element)[indexDest:].find("<")
			dest = str(element)[indexDest:indexDestend]

			indexCoord = str(element).find("Coord. ") +  7
			indexCoordend = indexCoord + str(element)[indexCoord:].find("<br")
			coord = str(element)[indexCoord:indexCoordend].strip(" ")

			el.append("Vortex")
			el.append(ident)
			el.append(dest)
			el.append(coord.split("/")[0])
			el.append(coord.split("/")[1])
			out.append(el)

		# Planete processing
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

def getDatasPlanets(cookies, link, playerName):

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

		typeIdName = str(element.find("h1"))[4:-5]

		if typeIdName[0] == "N":
			ident = typeIdName.split("<br/>")[0][8:]
			name = typeIdName.split("<br/>")[1].strip("\n")
			image = str(element.find("img"))[12:-3]
			iCoord = str(element).find("\"/>") + 3
			iCoordEnd = iCoord + str(element)[iCoord:].find("<br/>") - 10
			coord = str(element)[iCoord:iCoordEnd]
			owner = element.find("a").contents[0]

			el.append("Vaisseau")
			el.append(ident)
			el.append(name)
			el.append(image)
			el.append(coord.split("/")[0].strip(" "))
			el.append(coord.split("/")[1].strip(" "))
			el.append(owner)
			out.append(el)

		elif typeIdName[0:2] == "Co":
			ident = typeIdName.split("<br/>")[0][10:]
			name = typeIdName.split("<br/>")[1].strip("\n")
			image = str(element.find("img"))[12:-3]
			iCoord = str(element).find("\"/>") + 3
			iCoordEnd = iCoord + str(element)[iCoord:].find("<br/>") - 10
			coord = str(element)[iCoord:iCoordEnd]
			owner = element.find("a").contents[0]

			el.append("Vaisseau")
			el.append(ident)
			el.append(name)
			el.append(image)
			el.append(coord.split("/")[0].strip(" "))
			el.append(coord.split("/")[1].strip(" "))
			el.append(owner)
			out.append(el)

		elif typeIdName[0:2] == "Cr":
			ident = typeIdName.split("<br/>")[0][9:]
			name = typeIdName.split("<br/>")[1].strip("\n")
			image = str(element.find("img"))[12:-3]
			iCoord = str(element).find("\"/>") + 3
			iCoordEnd = iCoord + str(element)[iCoord:].find("<br/>") - 10
			coord = str(element)[iCoord:iCoordEnd]
			owner = element.find("a").contents[0]

			el.append("Vaisseau")
			el.append(ident)
			el.append(name)
			el.append(image)
			el.append(coord.split("/")[0].strip(" "))
			el.append(coord.split("/")[1].strip(" "))
			el.append(owner)
			out.append(el)

		elif typeIdName[0] == "F":
			ident = typeIdName.split("<br/>")[0][8:]
			name = typeIdName.split("<br/>")[1].strip("\n")
			image = str(element.find("img"))[12:-3]
			iCoord = str(element).find("\"/>") + 3
			iCoordEnd = iCoord + str(element)[iCoord:].find("<br/>") - 10
			coord = str(element)[iCoord:iCoordEnd]
			owner = element.find("a").contents[0]

			el.append("Vaisseau")
			el.append(ident)
			el.append(name)
			el.append(image)
			el.append(coord.split("/")[0].strip(" "))
			el.append(coord.split("/")[1].strip(" "))
			el.append(owner)
			out.append(el)

		elif typeIdName[2:5] == "img":
			image = str(element.find("img"))[12:-3]

			iTI = str(element).find("\"/>") + 12
			iTIEnd = iTI + str(element)[iTI:].find("<br/>")
			iNameEnd = iTIEnd + str(element)[iTIEnd:].find("</h1>")
			iCoordEnd = iNameEnd + str(element)[iNameEnd:].find("<br/>") - 10
			ti = str(element)[iTI:iTIEnd]
			name = str(element)[iTIEnd+5:iNameEnd]
			coord = str(element)[iNameEnd+5:iCoordEnd]
			owner = element.find("a").contents[0]
		
			if owner.encode("utf-8") == "Gérer":
				owner = playerName

			el.append("Planete")
			el.append(ti)
			el.append(name)
			el.append(image)
			el.append(coord.split("/")[0].strip(" "))
			el.append(coord.split("/")[1].strip(" "))
			el.append(owner)
			out.append(el)

		else:

			data = typeIdName.split(" ")
			nb = data[0]
			x = data[3]
			y = data[5]


			i = 0
			for e in element.findAll("div", attrs={"class":"sousgroupe"}):
				items = str(e).split("<br/><br/>")
				for item in items:
					if (len(item) >= 20):
						i += 1

						iImage = item.find("/images/")
						iImageEnd = iImage + item[iImage:].find("\"/>")
						image = item[iImage:iImageEnd]

						if image[8] == 'v':
							iIdNameEnd = iImageEnd + item[iImageEnd:].find(" de <a")
							idName = item[iImageEnd+3:iIdNameEnd]

							iOwner = item.find("gauche\">") + 8
							iOwnerEnd = iOwner + item[iOwner:].find("</a>")
							owner = item[iOwner:iOwnerEnd]
							el.append("Vaisseau")
							el.append(idName.split("-")[0].strip(" "))
							el.append(idName.split("-")[1].strip(" "))
							el.append(image)
							el.append(x)
							el.append(y)
							el.append(owner)
							out.append(el)

						elif image[8] == 'p':
							iIdNameEnd = iImageEnd + item[iImageEnd:].find("<a href")
							idName = item[iImageEnd+6:iIdNameEnd]

							iOwner = item.find("gauche\">") + 12
							iOwnerEnd = iOwner + item[iOwner:].find("</a>")
							owner = item[iOwner:iOwnerEnd]

							if owner == "":
								owner = "Rebelles"

							el.append("Planete")
							el.append(idName.split("-")[0].strip(" "))
							el.append(idName.split("-")[1].strip(" "))
							el.append(image)
							el.append(x)
							el.append(y)
							el.append(owner)
							out.append(el)

						else:
							syslog.syslog("Error: element unknown during planet radar parsing - player:%s - link:%s - item:%s" % (playerName, link, item))

						el = []

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
	
	linksShips = getShipLinks(cookies)
	linksPlanets = getPlanetLinks(cookies)
	
	datas = []

	for i in range(len(linksShips)):
		datas.extend(getDatas(cookies, linksShips[i], playerName))
		print "{0:.0f}% ships's radars processed...".format(float(i+1)/len(linksShips) * 100)

	for i in range(len(linksPlanets)):
		datas.extend(getDatasPlanets(cookies, linksPlanets[i], playerName))
		print "{0:.0f}% planets's radars processed...".format(float(i+1)/len(linksPlanets) * 100)

	return datas



