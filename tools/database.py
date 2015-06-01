#!/usr/bin/python
# -*- coding: utf8 -*-

from pymongo import MongoClient
import syslog

def insertData(data, db, name, cycle):

    if data[0] == 'Vaisseau' or data[0] == 'Planete':
    	post = {'type':data[0], 'id':data[1], 'nom':data[2], 'image':data[3], 'x':data[4], 'y':data[5], 'owner':data[6], 'from':[name]}
    else:
	post = {'type':data[0], 'id':data[1], 'destination':data[2], 'x':data[3], 'y':data[4], 'from':[name]}

    col = db['tour_%s' % cycle]

    if col.find_one({"type":data[0], "id":data[1]}) == None:
        col.insert(post)

    return

def insertAllDatas(datas, name, cycle):

    client = MongoClient('localhost', 27017)
    db = client['test']

    for data in datas:
	insertData(data, db, name, cycle)

    syslog.openlog()
    syslog.syslog("Datas imported from %s's radars" % name)
    
    return
