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

def getShipDatas(cookies, link):
	# Recuperation du premier radar
	op3 = urllib2.build_opener() 
	op3.addheaders.append(('Cookie', "; ".join('%s=%s' % (cookie.name,cookie.value) for cookie in cookies))) 
	f3 = op3.open(link) 
	d3 = f3.read() 
	h3 = etree.HTML(d3) 
	r3 = etree.tostring(h3, pretty_print=True, method="html")
	s3 = BeautifulSoup(r3) 

	out = []
	
	for element in s3.findAll('div', attrs={"class":"carte_bulle"}):
		print element
		print "-----"
		el = []
		IdName = unicode(element.find("h1")).strip("<h1>").strip("</h1").strip("Navette ").strip("\n").split("<br/>")
		el.append(IdName[0])
		if len(IdName) > 1:
			el.append(IdName[1])
		#el.append(element.find("h1").text.strip("Navette ").strip("\n"))
		#el.append(name)
		el.append(element.find("img")['src'])
		el.append(element.find("img").contents)
		el.append(element.find("a").contents)
		out.append(el)

	return out

def printShip(ship):
	
	print("Identifiant : %s" % ship[0])
	print("Nom : %s" % ship[1])
	print("Type : %s" % ship[2])
	print("Position : %s" % ship[3]) #marche pas
	print("Propriétaire : %s" % ship[4])

	return

def getAllShipsDatas(cookies):
	
	links = getShipLinks(cookies)
	
	datas = []

	for i in range(1):
	#for i in range(len(links)):
		datas.extend(getShipDatas(cookies, links[i]))
		print "{0:.0f}% radars processed...".format(float(i+1)/len(links) * 100)
	
	return datas
