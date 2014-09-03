from fabric.operations import prompt
from fabric.api import *
from fabric.colors import green, red
from fabric.contrib.project import upload_project
def server() :
    """This pushes to the EC2 instance defined below"""
    # The Elastic IP to your server
    env.host_string = 'halftone.co'
    # your user on that system
    env.user = 'ubuntu' 
    # Assumes that your *.pem key is in the same directory as your fabfile.py
    env.key_filename = '~/.ssh/deployment.pem'

def install() :
    # path to the directory on the server where your vhost is set up
    path   = "/var/www/{FILLINTHEBLANK}"
    domain = "halftone.co"
    repo   = "git@bitbucket.org:halftoneinc/{FILLINTHEBLANK}.git"
    folder_name = "alcatel-lucent"
    # name of the application process
    process = "staging"

    print(red("Beginning Deploy:"))
    print(green("Checking for dist directory"))
    run("[[ -d %s ]] || sudo mkdir -p %s" % (path, path))
    run("sudo chown %s %s" % (env.user, path))
    run("sudo chgrp %s %s" % (env.user, path))

    with cd("%s" % (path)) :
        run("pwd")
        print(green("Pulling master from GitHub..."))
        run("git clone %s %s" % (repo, folder_name))
    print(red("DONE!"))

def staging() :
    # path to the directory on the server where your vhost is set up
    path   = "/var/www/clients/{FILLINTHEBLANK}"
    domain = ""
    # name of the application process
    process = "staging"

    version_number = prompt("enter version number")
    print(green("Moving created HTML"))
    local("mv converted-html %s" % version_number)
    print(red("Beginning Deploy:"))
    print(green("Checking for %s directory" % version_number))

    run("rm -rf %s/%s/" % (path, version_number))
    upload_project("./%s/" % version_number, path)
    local("rm -rf %s" % version_number)
    print(red("DONE!"))