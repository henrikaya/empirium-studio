#!/usr/bin/python
# -*- coding: utf8 -*-

from pymongo import MongoClient

def insertData(data, db):

    if (len(data) < 7):
        return -1

    post = {'type':data[0], 'id':data[1], 'nom':data[2], 'image':data[3], 'x':data[4], 'y':data[5], 'owner':data[6]}

    col = db['tour_533']

    if col.find_one({"id":data[1]}) == None:
        col.insert(post)
    else:
        print "Element %s deja present" % data[1]

    return

def insertAllDatas(datas):

    client = MongoClient('localhost', 27017)
    db = client['test']

    for data in datas:
	insertData(data, db)

    return
