#!/usr/bin/python
# -*- coding: utf8 -*-

import connexion
import parsing

if __name__ == '__main__':

	cookies = connexion.connect('5221','f631fb3e62c97949860c7d5e164651a3')
	datas = parsing.getAllShipsDatas(cookies)

	parsing.printShip(datas[0])
	parsing.printShip(datas[1])
