import tornadoredis


def setup_caching_store():
	"""
		Create a global redis client and connect to the local instance 
	"""
	global CACHING_STORE
	CACHING_STORE = tornadoredis.Client()
	CACHING_STORE.connect()