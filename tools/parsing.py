#!/usr/bin/python
# -*- coding: utf8 -*-

import urllib, urllib2
import cookielib
from bs4 import BeautifulSoup
from lxml import etree
import syslog
from pymongo import MongoClient
import time

def getCycleNumber():

	opener = urllib2.build_opener()
	f = opener.open("http://v2.empirium.net")
	html = etree.HTML(f.read())
	result = etree.tostring(html, pretty_print=True, method="html")

	coord = result.find("[ Tour n") + 14

	if coord < 14:
		return -1

	return int(result[coord:coord+3])

def getPlayersList():

	opener = urllib2.build_opener()
	f = opener.open("http://v2.empirium.net")
	html = etree.HTML(f.read())
	result = etree.tostring(html, pretty_print=True, method="html")
	soup = BeautifulSoup(result)

	for selector in soup.findAll("select", attrs={'name':'joueur'}):
		out = []
		for option in selector.findAll("option"):
			player = {}
			player['id'] = option['value']
			player['name'] = option.contents[0].encode("utf8").strip("\t").strip("\n")
			out.append(player)
	return out

def getShipLinks(cookies):
	
	opener2 = urllib2.build_opener() 
	opener2.addheaders.append(('Cookie', "; ".join('%s=%s' % (cookie.name,cookie.value) for cookie in cookies))) 
	f = opener2.open("http://v2.empirium.net/pan.php3?th=com") 
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

def getGroupDatas(cookies, link, playerName):

	# Recuperation du radar
	op3 = urllib2.build_opener() 
	op3.addheaders.append(('Cookie', "; ".join('%s=%s' % (cookie.name,cookie.value) for cookie in cookies))) 
	try:
		f3 = op3.open("http://v2.empirium.net" + link[1:]) 
	except Exception, e:
		syslog.syslog("Error during getGroupDatas - player:%s - link:%s - error:%s" % (playerName, link, e))
	d3 = f3.read()
	h3 = etree.HTML(d3) 
	r3 = etree.tostring(h3, pretty_print=True, method="html")
	s3 = BeautifulSoup(r3)

	out = []
	lordName = "Propriétaire inconnu"

	iCoord = link.find("&") + 1
	coordX = link[iCoord:].split("&")[0].strip("X=")
	coordY = link[iCoord:].split("&")[1].strip("Y=")

	for element in s3.findAll("li"):
		el = {}
		idName = element.text.split(" - ")
		image = str(element.find("img")['src'])[2:]

		if str(idName[0][1:9]) == "Seigneur":
			iNameEnd = idName[0].find(" : ")
			lordName = idName[0][10:iNameEnd]
		else:
			ident = idName[0][1:]
			if len(idName) >= 2:
				name = idName[1]
			else:
				name = ""

			el["type"] = "Vaisseau"
			el["id"] = ident
			el["name"] = name
			el["image"] = image
			el["x"] = coordX
			el["y"] = coordY
			out.append(el)

	for e in out:
		e["owner"] = lordName

	return out

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
	group_links = []

	# Pour chaque element visible sur le radar	
	for element in s3.findAll('div', attrs={"class":"carte_bulle"}):

		try:
			el = {}
			# Get element type (Fregate, Navette,
			# Planete, Groupe, ...)
			type_complet = element.find("h1").text
			if type_complet[0] != '\n':
				type = type_complet[0]
			else:
				type = type_complet[1]

			# Navette, Fregate and Croiseur processing
			if (type == 'N' or type == 'F' or type == 'C' or type == 'L'):

				ident = element.find("h1").contents[0].encode("utf8").split(" ")[1]
				name = element.find("h1").contents[2].encode("utf8")

				indexCoordStart = str(element).find("<img")
				indexCoordStart += str(element)[indexCoordStart:].find(">") + 1
				indexCoordEnd = indexCoordStart + str(element)[indexCoordStart:].find("<br/>") - 10
				coord = str(element)[indexCoordStart:indexCoordEnd].strip(" ").split("/")
	
	 			el["type"] = "Vaisseau"
				el["id"] = ident
				el["name"] = name
				el["image"] = element.find("img")['src'][2:]
				el["x"] = coord[0].strip(" ")
				el["y"] = coord[1].strip(" ")
				el["owner"] = element.find("a").contents[0].encode("utf8")
	
				if (el["owner"] == "Gérer" or el["owner"] == "Déplacer"):
					el["owner"] = playerName

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
	
				el["type"] = "Vortex"
				el["id"] = ident
				el["destination"] = dest
				el["x"] = coord.split("/")[0]
				el["y"] = coord.split("/")[1]
				out.append(el)
	
			# Planete processing
			elif type == 'P':
				index = str(element.find("h1")).find("Planète")
				idName = str(element.find("h1"))[index:].strip("Planète ")[:-5].strip("\n").split("<br/>")
				owner = element.find("a").contents[0].encode('utf8')
				if (owner == "Gérer"):
					owner = playerName
				indexCoordStart = str(element).find("</h1>") + 5
				indexCoordEnd = indexCoordStart + str(element)[indexCoordStart:].find("<br/>") - 10
				coord = str(element)[indexCoordStart:indexCoordEnd] 
	
				el["type"] = "Planete"			
				el["id"] = idName[0]
				el["name"] = idName[1]
				el["image"] = element.find("h1").find("img")['src'][2:]
				el["x"] = coord.split("/")[0]
				el["y"] = coord.split("/")[1]
				el["owner"] = owner

				out.append(el)

			# In case of many many elements (> 10)
			elif type == 'E':
				
				iCoordEnd = element.find("</h1>")
				group_links.append(element.find("a")['href'])
			else:
				indexCoord = type_complet.find("en ") + 3
				coord = type_complet[indexCoord:].strip(" ")
				coordX = coord.split("/")[0]
				coordY = coord.split("/")[1]
				for group in element.findAll("div", attrs={"class":"sousgroupe"}):
					for elmt in str(group).split("<br/><br/>"):
						el = {}
						elmt = elmt.replace("\n", " ")
						if elmt[1]=='d':
							elmt = elmt[24:]
						if elmt[2]!='/':
							if len(elmt) < 20:
								continue
							if elmt[19] == 'v':
								elmt = elmt[1:]
							if elmt[18:20] == 'vsx':
								index1 = elmt.find(">")
								index2 = index1 + elmt[index1:].find(" - ")
								id = elmt[index1+1:index2]
								index3 = index2 + elmt[index2:].find(" de <")
	
								if index3 < index2:
									index3 = index2 + elmt[index2:].find("<br/><a")
	
								nom = elmt[index2+3:index3]
								index4 = elmt.find("/")
								index5 = index4 + elmt[index4:].find("\"")
								type = elmt[index4:index5]
								index6 = elmt.find("\"gauche\">") + 9
								index7 = index6 + elmt[index6:].find("</a>")
								owner = elmt[index6:index7]
								el["type"] = "Vaisseau"
								el["id"] = id
								el["name"] = nom
								el["image"] = type
								el["x"] = coordX
								el["y"] = coordY
								el["owner"] = owner
	
								if (el["owner"] == "Gérer" or el["owner"] == "Déplacer"):
									el["owner"] = playerName
	
								out.append(el)
							elif elmt[18:20] == "vor":
								index1 = elmt.find(">")
								index2 = index1 + elmt[index1:].find(" - ")
								id = elmt[index1+1:index2]
								index3 = index2 + elmt[index2:].find(" de <")
	
								if index3 < index2:
									index3 = index2 + elmt[index2:].find("<br/><a")
	
								nom = elmt[index2+3:index3]
								index4 = elmt.find("/")
								index5 = index4 + elmt[index4:].find("\"")
								type = elmt[index4:index5]
								index6 = elmt.find("\"gauche\">") + 9
								index7 = index6 + elmt[index6:].find("</a>")
								owner = elmt[index6:index7]
								el["type"] = "Vortex"
								el["id"] = id
								el["destination"] = ""
								el["x"] = coordX
								el["y"] = coordY
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
								el["type"] = "Planete"
								el["id"] = id
								el["name"] = nom
								el["image"] = type
								el["x"] = coordX
								el["y"] = coordY
								el["owner"] = owner
								out.append(el)

		except Exception, e:
			syslog.syslog("Error during ship radar parsing - player:%s - link:%s - element:%s - error:%s" % (playerName, link, element, e))
			continue

	return out, group_links
	
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
		el = {}
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

			el["type"] = "Vaisseau"
			el["id"] = ident
			el["name"] = name
			el["image"] = image
			el["x"] = coord.split("/")[0].strip(" ")
			el["y"] = coord.split("/")[1].strip(" ")
			el["owner"] = owner
			out.append(el)

		elif typeIdName[0:2] == "Co":
			ident = typeIdName.split("<br/>")[0][10:]
			name = typeIdName.split("<br/>")[1].strip("\n")
			image = str(element.find("img"))[12:-3]
			iCoord = str(element).find("\"/>") + 3
			iCoordEnd = iCoord + str(element)[iCoord:].find("<br/>") - 10
			coord = str(element)[iCoord:iCoordEnd]
			owner = element.find("a").contents[0]

			el["type"] = "Vaisseau"
			el["id"] = ident
			el["name"] = name
			el["image"] = image
			el["x"] = coord.split("/")[0].strip(" ")
			el["y"] = coord.split("/")[1].strip(" ")
			el["owner"] = owner
			out.append(el)

		elif typeIdName[0:2] == "Cr":
			ident = typeIdName.split("<br/>")[0][9:]
			name = typeIdName.split("<br/>")[1].strip("\n")
			image = str(element.find("img"))[12:-3]
			iCoord = str(element).find("\"/>") + 3
			iCoordEnd = iCoord + str(element)[iCoord:].find("<br/>") - 10
			coord = str(element)[iCoord:iCoordEnd]
			owner = element.find("a").contents[0]

			el["type"] = "Vaisseau"
			el["id"] = ident
			el["name"] = name
			el["image"] = image
			el["x"] = coord.split("/")[0].strip(" ")
			el["y"] = coord.split("/")[1].strip(" ")
			el["owner"] = owner
			out.append(el)

		elif typeIdName[0] == "F":
			ident = typeIdName.split("<br/>")[0][8:]
			name = typeIdName.split("<br/>")[1].strip("\n")
			image = str(element.find("img"))[12:-3]
			iCoord = str(element).find("\"/>") + 3
			iCoordEnd = iCoord + str(element)[iCoord:].find("<br/>") - 10
			coord = str(element)[iCoord:iCoordEnd]
			owner = element.find("a").contents[0]

			el["type"] = "Vaisseau"
			el["id"] = ident
			el["name"] = name
			el["image"] = image
			el["x"] = coord.split("/")[0].strip(" ")
			el["y"] = coord.split("/")[1].strip(" ")
			el["owner"] = owner
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

			el["type"] = "Planete"
			el["id"] = ti
			el["name"] = name
			el["image"] = image
			el["x"] = coord.split("/")[0].strip(" ")
			el["y"] = coord.split("/")[1].strip(" ")
			el["owner"] = owner
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
							el["type"] = "Vaisseau"
							el["id"] = idName.split("-")[0].strip(" ")
							el["name"] = idName.split("-")[1].strip(" ")
							el["image"] = image
							el["x"] = x
							el["y"] = y
							el["owner"] = owner
							out.append(el)

						elif image[8] == 'p':
							iIdNameEnd = iImageEnd + item[iImageEnd:].find("<a href")
							idName = item[iImageEnd+6:iIdNameEnd]

							iOwner = item.find("gauche\">") + 12
							iOwnerEnd = iOwner + item[iOwner:].find("</a>")
							owner = item[iOwner:iOwnerEnd]

							if owner == "":
								owner = "Rebelles"

							el["type"] = "Planete"
							el["id"] = idName.split("-")[0].strip(" ")
							el["name"] = idName.split("-")[1].strip(" ")
							el["image"] = image
							el["x"] = x
							el["y"] = y
							el["owner"] = owner
							out.append(el)

						else:
							syslog.syslog("Error: element unknown during planet radar parsing - player:%s - link:%s - item:%s" % (playerName, link, item))

						el = {}

	return out

def getAllDatas(cookies, playerName, id_request, db_host, db_port):

	client = MongoClient(db_host, db_port)
	col_update = client['requests']['update']

	cycle = getCycleNumber()

	post = {}
	post['player'] = playerName
	post['status'] = 'processing'
	post['analyze'] = 0
	post['base'] = 0
	post['groups'] = 0
	post['cycle'] = cycle

	linksShips = getShipLinks(cookies)
	linksPlanets = getPlanetLinks(cookies)

	datas = []
	group_links = []

	total_count = len(linksShips)
	total_count += len(linksPlanets)

	for i in range(len(linksShips)):
		shipDatas, group_link = getDatas(cookies, linksShips[i], playerName)
		group_links.extend(group_link)
		datas.extend(shipDatas)
		percent = float(i+1)/total_count
		col_update.update({'id':id_request,'status':'processing', 'cycle':cycle},{'$set':{'analyze':percent}})

	group_links = list(set(group_links))
	for i in range(len(group_links)):
		datas.extend(getGroupDatas(cookies, group_links[i], playerName))

	for i in range(len(linksPlanets)):
		datas.extend(getDatasPlanets(cookies, linksPlanets[i], playerName))
		percent = float(i+1 + len(linksShips))/total_count
		col_update.update({'id':id_request,'status':'processing', 'cycle':cycle},{'$set':{'analyze':percent}})

	
	return datas

if __name__ == "__main__":

	print getPlayersList()
