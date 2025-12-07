# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/trusty64"
  config.vm.provision :shell, path: "bootstrap.sh"
  config.vm.network "public_network"

  config.vm.provider "virtualbox" do |vb|
     vb.memory = "2048"
  end
end
