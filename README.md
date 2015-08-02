# Empirium Studio

This web application is an unofficial navigation and visualization tool for [Empirium Game] (http://v2.empirium.net).

It offers a user-friendly map for ships and planets visualization, a simple tool to share datas and maps between allies and a set of informations about technologies.
See the [wiki] (https://github/henrikaya/empirium-studio/wiki) for more details.

To install and launch web-server, please :

1. Be sure that mongodb and rsyslog are installed and running

2. Configure server with webserver.conf file

3. Run: ```python worker.py``` (as a service)

4. Run: ```python webserver.py``` (as a service)

# Compatibilities

| Software          | Version           |
|-------------------|-------------------|
| Empirium Studio   | master            |
| Empirium Game     | 2                 |
| MongoDB           | 2.4.10            |
| Rsyslog           | 8.4.2             |
| Python            | 2.7               |
| pymongo           | 2.7.2             |
| bs4               | 4.3.2             |
| flask             | 0.10.1            |

