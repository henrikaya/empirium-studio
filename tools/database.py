#!/usr/bin/python
# -*- coding: utf8 -*-

from pymongo import MongoClient
import syslog

EQU_MATRIX = {}

def insertData(data, db, name, cycle):

    if data["type"] == 'Vaisseau':

	if data["image"][11] == '/':
		model = EQU_MATRIX[data["image"][12:]]
	else:
		model = EQU_MATRIX[data["image"][14:]]

    	post = {'type':data["type"], 'id':data["id"], 'nom':data["name"], 'image':data["image"], 'x':data["x"], 'y':data["y"], 'owner':data["owner"], 'from':[name], 'model':model}

    elif data["type"] == 'Planete':

    	post = {'type':data["type"], 'id':data["id"], 'nom':data["name"], 'image':data["image"], 'x':data["x"], 'y':data["y"], 'owner':data["owner"], 'from':[name]}

    else:

	post = {'type':data["type"], 'id':data["id"], 'destination':data["destination"], 'x':data["x"], 'y':data["y"], 'from':[name]}

    col = db['tour_%s' % cycle]

    previous =  col.find_one({"type":data["type"], "id":data["id"]})
    if previous == None:
        col.insert(post)
    else:
	# if data exists in dabase, but not from this playername, we add playername to the list "from"
	if not name in previous['from']:
	    previous['from'].append(name)
	    col.update({"type":data["type"], "id":data["id"]}, {"$set":{"from":previous['from']}}, multi=False)

    return

def insertAllDatas(datas, name, cycle):

    EQU_MATRIX['frg_2.gif'] = "Commodore"
    EQU_MATRIX['commodore1.gif'] = "Commodore"
    EQU_MATRIX['commodore2.gif'] = "Commodore"
    EQU_MATRIX['commodore3.gif'] = "Commodore"
    EQU_MATRIX['commodore4.gif'] = "Commodore"
    EQU_MATRIX['commodore5.gif'] = "Commodore"
    EQU_MATRIX['commodore6.gif'] = "Commodore"
    EQU_MATRIX['commodore7.gif'] = "Commodore"
    EQU_MATRIX['commodore8.gif'] = "Commodore"
    EQU_MATRIX['commodore9.gif'] = "Commodore"
    EQU_MATRIX['commodore10.gif'] = "Commodore"
    EQU_MATRIX['commodore11.gif'] = "Commodore"
    EQU_MATRIX['commodore12.gif'] = "Commodore"
    EQU_MATRIX['commodore13.gif'] = "Commodore"
    EQU_MATRIX['commodore14.gif'] = "Commodore"
    EQU_MATRIX['commodore15.gif'] = "Commodore"
    EQU_MATRIX['commodore16.gif'] = "Commodore"
    EQU_MATRIX['commodore17.gif'] = "Commodore"
    EQU_MATRIX['commodore18.gif'] = "Commodore"
    EQU_MATRIX['commodore19.gif'] = "Commodore"

    EQU_MATRIX['frg_1.gif'] = "Frégate minière"
    EQU_MATRIX['frg_3.gif'] = "Frégate commerciale"
    EQU_MATRIX['frg_4.gif'] = "Frégate d'assaut"
    EQU_MATRIX['frg_5.gif'] = "Frégate de soutien"
    EQU_MATRIX['frg_6.gif'] = "Frégate cargo"
    EQU_MATRIX['frg_18.gif'] = "Frégate méca-constructeur"
    EQU_MATRIX['frg_19.gif'] = "Frégate bio-constructeur"
    EQU_MATRIX['frg_25.gif'] = "Frégate nexus"

    EQU_MATRIX['frg_7.gif'] = "Navette commerciale"
    EQU_MATRIX['frg_8.gif'] = "Navette minière"
    EQU_MATRIX['frg_9.gif'] = "Navette polymod"
    EQU_MATRIX['frg_10.gif'] = "Navette d'assaut"
    EQU_MATRIX['frg_11.gif'] = "Navette cargo"
    EQU_MATRIX['frg_24.gif'] = "Navette nexus"

    EQU_MATRIX['frg_12.gif'] = "Croiseur commercial"
    EQU_MATRIX['frg_13.gif'] = "Croiseur minier"
    EQU_MATRIX['frg_14.gif'] = "Croiseur d'assaut"
    EQU_MATRIX['frg_15.gif'] = "Croiseur complexe"
    EQU_MATRIX['frg_16.gif'] = "Croiseur méca-constructeur"
    EQU_MATRIX['frg_17.gif'] = "Croiseur bio-constructeur"
    EQU_MATRIX['frg_20.gif'] = "Croiseur (type inconnu)"
    EQU_MATRIX['frg_21.gif'] = "Croiseur (type inconnu)"
    EQU_MATRIX['frg_22.gif'] = "Croiseur (type inconnu)"
    EQU_MATRIX['frg_23.gif'] = "Croiseur (type inconnu)"
    EQU_MATRIX['frg_26.gif'] = "Croiseur nexus"
    EQU_MATRIX['frg_27.gif'] = "Croiseur (type inconnu)"
    EQU_MATRIX['frg_28.gif'] = "Croiseur (type inconnu)"
    EQU_MATRIX['frg_29.gif'] = "Croiseur (type inconnu)"
    EQU_MATRIX['frg_30.gif'] = "Croiseur (type inconnu)"
    EQU_MATRIX['frg_32.gif'] = "Croiseur (type inconnu)"

    EQU_MATRIX['frg_32.gif'] = "Xénoforme alpha"
    EQU_MATRIX['frg_32.gif'] = "Xénoforme beta"

    client = MongoClient('localhost', 27017)
    db = client['test']

    for data in datas:
#	try:
		insertData(data, db, name, cycle)
#	except Exception, e:
#		syslog.syslog("Exception during data insertion : %s" % e)

    syslog.openlog()
    syslog.syslog("Datas imported from %s's radars" % name)
    
    return

def updateCycleNumber(name, cycle):

	client = MongoClient('localhost', 27017)
	col = client['joueurs']['joueurs']

	col.update({"name":name}, {"$set":{"last_update":cycle}}, multi=False)
