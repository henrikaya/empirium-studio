#!/usr/bin/python
# -*- coding: utf8 -*-

from pymongo import MongoClient
import syslog
import sys

reload(sys)
sys.setdefaultencoding('utf-8')

EQU_MATRIX = {}

def computeNumberNeighbors(cycle, db_host, db_port, name, playersList, id_request):

    	client = MongoClient(db_host, db_port)
	col = client['radars']['cycle_%s' % cycle]
    	col_update = client['requests']['update']

	i = 1
	elements = col.find({"neighbors":0})
	elements_size = elements.count()
	for element in elements:
		# Update number of neighbors
		x = element['x']
		y = element['y']
		neighbors = col.find({'x':x, 'y':y, 'type':{'$ne':'Group'}})
		n = neighbors.count() - 1
	    	col.update({"id":element["id"]}, {"$set":{"neighbors":n}}, multi=False)

		# Create group if it doesn't exist
		if n > 0:
		    if col.find({'x':x, 'y':y, 'type':'Group'}).count() == 0:

			# Count number of elements for each owner
			owners = {}
			for neighbor in neighbors:
				if owners.has_key(neighbor['owner']):
					if owners[neighbor['owner']].has_key(neighbor['model']):
						if neighbor.has_key('model'):
							owners[neighbor['owner']][neighbor['model']]['quantity'] += 1
						else:
							owners[neighbor['owner']][neighbor['type']]['quantity'] += 1
					else:
						if neighbor.has_key('model'):
							owners[neighbor['owner']][neighbor['model']] = {}
							owners[neighbor['owner']][neighbor['model']]['quantity'] = 1
							image = neighbor['image'].split("/")[3]
							owners[neighbor['owner']][neighbor['model']]['image'] = image
						else:
							owners[neighbor['owner']][neighbor['type']] = {}
							owners[neighbor['owner']][neighbor['type']]['quantity'] = 1
							image = neighbor['image'].split("/")[3]
							owners[neighbor['owner']][neighbor['type']]['image'] = image
				else:
					owners[neighbor['owner']] = {}
					if neighbor.has_key('model'):
						owners[neighbor['owner']][neighbor['model']] = {}
						owners[neighbor['owner']][neighbor['model']]['quantity'] = 1
						image = neighbor['image'].split("/")[3]
						owners[neighbor['owner']][neighbor['model']]['image'] = image
					else:
						owners[neighbor['owner']][neighbor['type']] = {}
						owners[neighbor['owner']][neighbor['type']]['quantity'] = 1
						image = neighbor['image'].split("/")[3]
						owners[neighbor['owner']][neighbor['type']]['image'] = image

			# Format elements and insert it
			elements = []
			for owner in owners:
				element = []
				for model in owners[owner]:
					element.append( {"model":model, "quantity":owners[owner][model]['quantity'], "image":owners[owner][model]['image']} )
				player_id = playersList[owner.encode("utf8")]
				elements.append( {"elements":element, "name":owner, "id":player_id} ) 
			col.insert({'x':x, 'y':y, 'type':'Group', 'from':[name], 'quantity':n+1, 'composition':elements})

		percent = float(i) / elements_size
		col_update.update({'id':id_request,'status':'processing', 'cycle':cycle},{'$set':{'groups':percent}})
		i += 1

def getPlayersList(db_host, db_port):

    	client = MongoClient(db_host, db_port)
	col = client['players']['players']

	out = {}
	for player in col.find():
		out[str(player['name']).encode("utf8")] = player['id']

	out['Rebelles'] = 0

	return out

def insertData(data, db, name, cycle, playersList):

    if data["type"] == 'Vaisseau':

	if data["image"][11] == '/':
		model = EQU_MATRIX[data["image"][12:]]
	else:
		model = EQU_MATRIX[data["image"][14:]]

    	post = {'type':data["type"], 'id':data["id"], 'nom':data["name"], 'image':data["image"], 'x':data["x"], 'y':data["y"], 'owner':data["owner"], 'owner_id':playersList[str(data["owner"]).encode("utf8")], 'from':[name], 'model':model, 'neighbors':0}

    elif data["type"] == 'Planete':

    	post = {'type':data["type"], 'id':data["id"], 'nom':data["name"], 'image':data["image"], 'x':data["x"], 'y':data["y"], 'owner':data["owner"], 'owner_id':playersList[str(data["owner"]).encode("utf8")], 'from':[name], 'neighbors':0}

    else:

	post = {'type':data["type"], 'id':data["id"], 'destination':data["destination"], 'x':data["x"], 'y':data["y"], 'from':[name], 'neighbors':0}

    col = db['cycle_%s' % cycle]

    previous =  col.find_one({"type":data["type"], "id":data["id"]})
    if previous == None:
        col.insert(post)
    else:
	# if data exists in dabase, but not from this playername, we add playername to the list "from"
	if not name in previous['from']:
	    previous['from'].append(name)
	    col.update({"type":data["type"], "id":data["id"]}, {"$set":{"from":previous['from']}}, multi=False)

    return

def insertAllDatas(datas, name, cycle, id_request, db_host, db_port):

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
    EQU_MATRIX['frg_2.gif'] = "Frégate d'invasion"
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
    EQU_MATRIX['frg_21.gif'] = "Navette d'invasion"
    EQU_MATRIX['frg_24.gif'] = "Navette nexus"

    EQU_MATRIX['frg_12.gif'] = "Croiseur commercial"
    EQU_MATRIX['frg_13.gif'] = "Croiseur minier"
    EQU_MATRIX['frg_14.gif'] = "Croiseur d'assaut"
    EQU_MATRIX['frg_15.gif'] = "Croiseur complexe"
    EQU_MATRIX['frg_16.gif'] = "Croiseur méca-constructeur"
    EQU_MATRIX['frg_17.gif'] = "Croiseur bio-constructeur"
    EQU_MATRIX['frg_20.gif'] = "Croiseur (type inconnu)"
    EQU_MATRIX['frg_22.gif'] = "Croiseur (type inconnu)"
    EQU_MATRIX['frg_23.gif'] = "Croiseur (type inconnu)"
    EQU_MATRIX['frg_26.gif'] = "Croiseur nexus"
    EQU_MATRIX['frg_27.gif'] = "Croiseur (type inconnu)"
    EQU_MATRIX['frg_28.gif'] = "Croiseur de soutien"
    EQU_MATRIX['frg_29.gif'] = "Croiseur (type inconnu)"
    EQU_MATRIX['frg_32.gif'] = "Croiseur (type inconnu)"

    EQU_MATRIX['frg_30.gif'] = "Leviathan"

    EQU_MATRIX['frg_32.gif'] = "Xénoforme alpha"
    EQU_MATRIX['frg_32.gif'] = "Xénoforme beta"

    client = MongoClient(db_host, db_port)
    db = client['radars']
    col_update = client['requests']['update']

    playersList = getPlayersList(db_host, db_port)

    i = 1
    for data in datas:
	try:
		insertData(data, db, name, cycle, playersList)
		percent = float(i) / len(datas)
		col_update.update({'id':id_request,'status':'processing', 'cycle':cycle},{'$set':{'base':percent}})
	except Exception, e:
		syslog.syslog("Exception during data insertion : %s" % e)
	i += 1
    try:
    	computeNumberNeighbors(cycle, db_host, db_port, name, playersList, id_request)
    except Exception, e:
	syslog.syslog("Exception during number of neighbors computation : %s" % e)

    col_update.update({'id':id_request,'status':'processing', 'cycle':cycle},{'$set':{'status':'done'}})
    syslog.openlog()
    syslog.syslog("Datas imported from %s's radars" % name)
    
    return

def updateCycleNumber(name, cycle, db_host, db_port):

    	client = MongoClient(db_host, db_port)
	col = client['players']['players']

	col.update({"name":name}, {"$set":{"last_update":cycle}}, multi=False)
