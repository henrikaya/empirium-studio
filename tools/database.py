#!/usr/bin/python
# -*- coding: utf8 -*-

from pymongo import MongoClient
import syslog

def insertData(data, db, name):

    if (len(data) < 7):
        return -1

    post = {'type':data[0], 'id':data[1], 'nom':data[2], 'image':data[3], 'x':data[4], 'y':data[5], 'owner':data[6], 'from':[name]}

    col = db['tour_535']

    if col.find_one({"id":data[1]}) == None:
        col.insert(post)

    return

def insertAllDatas(datas, name):

    client = MongoClient('localhost', 27017)
    db = client['test']

    for data in datas:
	insertData(data, db, name)

    syslog.openlog()
    syslog.syslog("Datas imported from %s's radars" % name)
    
return
