#!/bin/bash

sudo apt-get -y update
sudo apt-get -y upgrade
sudo apt-get -y dist-upgrade
sudo apt-get -y install build-essential libssl-dev libffi-dev libreadline-dev libbz2-dev libsqlite3-dev libncurses5-dev
cd $HOME
wget https://www.python.org/ftp/python/2.7.13/Python-2.7.13.tar.xz
tar xvf Python-2.7.13.tar.xz
cd Python-2.7.13
./configure --prefix=$HOME/python2713
make
make install
~/python2713/bin/python -m ensurepip
~/python2713/bin/python -m pip install -U pip
 ~/python2713/bin/pip install requests==2.5.3
~/python2713/bin/pip install crossbar
echo "export PATH=\${HOME}/python2713/bin:\${PATH}" >> $HOME/.profile
source $HOME/.profile
