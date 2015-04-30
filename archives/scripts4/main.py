#!/usr/bin/python
# -*- coding: utf8 -*-

import connexion
import parsing

if __name__ == '__main__':

	cookies = connexion.connect('5221','f631fb3e62c97949860c7d5e164651a3')
	datas = parsing.getAllDatas(cookies, "Charles Le Chaleureux")

	print "%s vaisseaux et planètes en base" % len(datas)

	print("------")
	parsing.printData(datas[10])
	print("------")
	parsing.printData(datas[len(datas)-5])
	print("------")
	parsing.printData(datas[len(datas)-4])
	print("------")
	parsing.printData(datas[len(datas)-3])
	print("------")
	parsing.printData(datas[len(datas)-2])
	print("------")
	parsing.printData(datas[len(datas)-1])
