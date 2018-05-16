# ConnApp Wamp API

[![Build Status](https://travis-ci.org/ConnApp/connapp-wamp.svg?branch=master)](https://travis-ci.org/ConnApp/connapp-wamp)

Wamp API and backend library for the ConnApp

# Instaltion

---

## First things frist

Before you do anything, clone or download the repo. Also, this installation tutorial
is only for Debian based systems.

```sh
git clone https://github.com/ConnApp/connapp-wamp.git
```

## Crossbar router

There are many ways to install and user your crossbar router, you can check them
out [here](http://crossbar.io/docs/Getting-Started/) if you prefer. I prefer to
to use a dedicated python installation for it.

To install it, simply run:

```sh
./install_crossbar.sh
```

It will download the dependencies, install the necessary files and set the right
env variables.

To start the router, run:

```sh
crossbar start
```

or

```sh
./start_crossbar.sh
```
