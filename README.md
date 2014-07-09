## dbpedia_widgets ##

Simple embeddable widgets

## Requirements ##

    Python 3.4
    virtualenv - not required but recommended
    NodeJS
    Gulp
    Bower


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


## Running Front-end ##

    #start the default task - builds and launches a server on port 9000
    gulp


## Running Proxy ##

    #activate the virtualenv environment
    source env/bin/activate
    
    #start the server on port 8000
    python proxy/server.py
    
    
