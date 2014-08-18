## dbpedia_widgets ##

Simple embeddable widgets

## Requirements ##

    Python 3.4
    virtualenv - not required but recommended
    NodeJS
    Gulp
    Bower
    Redis server
        Ubuntu: apt-get install redis-server
        OS X w/ Homebrew: brew install redis


## Setting Up ##

    #install gulp, bower globally
    npm install -g gulp bower

    #install compass
    gem update --system
    gem install compass

    #clone this repo or your fork
    git clone
    cd dbpedia-widgets

    #install frontend dependencies
    npm install && bower install
    
    #install virtualenv
    pip install virtualenv
    
    #create a virtual environment using python 3.4
    virtualenv -p `which python3.4` --no-site-packages env 
    
    #activate the newly created environment
    source env/bin/activate
    
    #install backend dependencies
    pip install -r requirements.txt


## Running ##
    #start a local redis server on the default port
    redis-server &

    #activate the virtualenv environment - only when using virtualenv
    source env/bin/activate
    
    #start the default task
    #builds and launches a server on port 9000
    #launches proxy on port 9000
    gulp
