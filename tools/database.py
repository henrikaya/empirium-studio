#!/usr/bin/python
# -*- coding: utf8 -*-

from pymongo import MongoClient
import syslog

EQU_MATRIX = {}

def insertData(data, db, name, cycle):

    if data[0] == 'Vaisseau':

	if data[3][11] == '/':
		model = EQU_MATRIX[data[3][12:]]
	else:
		model = EQU_MATRIX[data[3][14:]]

    	post = {'type':data[0], 'id':data[1], 'nom':data[2], 'image':data[3], 'x':data[4], 'y':data[5], 'owner':data[6], 'from':[name], 'model':model}

    elif data[0] == 'Planete':

    	post = {'type':data[0], 'id':data[1], 'nom':data[2], 'image':data[3], 'x':data[4], 'y':data[5], 'owner':data[6], 'from':[name]}

    else:

	post = {'type':data[0], 'id':data[1], 'destination':data[2], 'x':data[3], 'y':data[4], 'from':[name]}

    col = db['tour_%s' % cycle]

    previous =  col.find_one({"type":data[0], "id":data[1]})
    if previous == None:
        col.insert(post)
    else:
	# if data exists in dabase, but not from this playername, we add playername to the list "from"
	if not name in previous['from']:
	    previous['from'].append(name)
	    col.update({"type":data[0], "id":data[1]}, {"$set":{"from":previous['from']}}, multi=False)

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

    EQU_MATRIX['frg_1.gif'] = "Frégate"
    EQU_MATRIX['frg_3.gif'] = "Frégate"
    EQU_MATRIX['frg_4.gif'] = "Frégate"
    EQU_MATRIX['frg_5.gif'] = "Frégate"
    EQU_MATRIX['frg_6.gif'] = "Frégate"
    EQU_MATRIX['frg_18.gif'] = "Frégate"
    EQU_MATRIX['frg_19.gif'] = "Frégate"
    EQU_MATRIX['frg_25.gif'] = "Frégate"

    EQU_MATRIX['frg_7.gif'] = "Navette"
    EQU_MATRIX['frg_8.gif'] = "Navette"
    EQU_MATRIX['frg_9.gif'] = "Navette"
    EQU_MATRIX['frg_10.gif'] = "Navette"
    EQU_MATRIX['frg_11.gif'] = "Navette"
    EQU_MATRIX['frg_24.gif'] = "Navette"

    EQU_MATRIX['frg_12.gif'] = "Croiseur"
    EQU_MATRIX['frg_13.gif'] = "Croiseur"
    EQU_MATRIX['frg_14.gif'] = "Croiseur"
    EQU_MATRIX['frg_15.gif'] = "Croiseur"
    EQU_MATRIX['frg_16.gif'] = "Croiseur"
    EQU_MATRIX['frg_20.gif'] = "Croiseur"
    EQU_MATRIX['frg_21.gif'] = "Croiseur"
    EQU_MATRIX['frg_22.gif'] = "Croiseur"
    EQU_MATRIX['frg_23.gif'] = "Croiseur"
    EQU_MATRIX['frg_26.gif'] = "Croiseur"
    EQU_MATRIX['frg_27.gif'] = "Croiseur"
    EQU_MATRIX['frg_28.gif'] = "Croiseur"
    EQU_MATRIX['frg_29.gif'] = "Croiseur"
    EQU_MATRIX['frg_30.gif'] = "Croiseur"
    EQU_MATRIX['frg_32.gif'] = "Croiseur"

    EQU_MATRIX['frg_32.gif'] = "Xénoforme"
    EQU_MATRIX['frg_32.gif'] = "Xénoforme"

    client = MongoClient('localhost', 27017)
    db = client['test']

    for data in datas:
	try:
		insertData(data, db, name, cycle)
	except Exception, e:
		syslog.syslog("Exception during data insertion : %s" % e)

    syslog.openlog()
    syslog.syslog("Datas imported from %s's radars" % name)
    
    return

def updateCycleNumber(name, cycle):

	client = MongoClient('localhost', 27017)
	col = client['joueurs']['joueurs']

	col.update({"name":name}, {"$set":{"last_update":cycle}}, multi=False)
